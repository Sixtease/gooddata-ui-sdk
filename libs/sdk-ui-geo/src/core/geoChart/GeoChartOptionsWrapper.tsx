// (C) 2020-2022 GoodData Corporation
import React from "react";
import invariant from "ts-invariant";
import { IGeoData, IValidationResult } from "../../GeoChart";
import { isDataOfReasonableSize } from "./helpers/geoChart/common";
import { getGeoData } from "./helpers/geoChart/data";
import { GeoChartInner, IGeoChartInnerOptions, IGeoChartInnerProps } from "./GeoChartInner";
import { DEFAULT_DATA_POINTS_LIMIT } from "./constants/geoChart";
import {
    DataViewFacade,
    ErrorCodes,
    IColorAssignment,
    IErrorDescriptors,
    newErrorMapping,
    ErrorComponent as DefaultErrorComponent,
    LoadingComponent as DefaultLoadingComponent,
} from "@gooddata/sdk-ui";
import { IColorPalette, isResultAttributeHeader } from "@gooddata/sdk-model";
import {
    getValidColorPalette,
    IColorStrategy,
    IPushpinCategoryLegendItem,
    fixEmptyHeaderItems,
} from "@gooddata/sdk-ui-vis-commons";
import { getColorStrategy } from "./colorStrategy/geoChart";

export class GeoChartOptionsWrapper extends React.Component<IGeoChartInnerProps> {
    private readonly emptyHeaderString: string;
    private readonly errorMap: IErrorDescriptors;

    constructor(props: IGeoChartInnerProps) {
        super(props);
        this.emptyHeaderString = props.intl.formatMessage({ id: "visualization.emptyValue" });
        this.errorMap = newErrorMapping(props.intl);
    }

    public render() {
        const { dataView, error, isLoading } = this.props;

        // if explicitly null, do not default the components to allow them to be disabled
        const ErrorComponent =
            this.props.ErrorComponent === null ? null : this.props.ErrorComponent ?? DefaultErrorComponent;
        const LoadingComponent =
            this.props.LoadingComponent === null
                ? null
                : this.props.LoadingComponent ?? DefaultLoadingComponent;

        if (error) {
            const errorProps =
                this.errorMap[
                    Object.prototype.hasOwnProperty.call(this.errorMap, error)
                        ? error
                        : ErrorCodes.UNKNOWN_ERROR
                ];
            return ErrorComponent ? <ErrorComponent code={error} {...errorProps} /> : null;
        }

        if (isLoading || !dataView) {
            return LoadingComponent ? <LoadingComponent /> : null;
        }

        return this.renderVisualization();
    }

    public renderVisualization(): React.ReactNode {
        const sanitizedProps: IGeoChartInnerProps = this.sanitizeProperties();

        const { dataView, onDataTooLarge } = sanitizedProps;

        const dv = DataViewFacade.for(dataView!);
        const geoData: IGeoData = getGeoData(dv);
        const validationResult = this.validateData(geoData, sanitizedProps);

        if (validationResult?.isDataTooLarge) {
            invariant(onDataTooLarge, "GeoChart's onDataTooLarge callback is missing.");
            onDataTooLarge();

            return null;
        }

        const geoChartOptions: IGeoChartInnerOptions = this.buildGeoChartOptions(geoData, sanitizedProps);
        return <GeoChartInner {...sanitizedProps} geoChartOptions={geoChartOptions} />;
    }

    private buildGeoChartOptions = (
        geoData: Readonly<IGeoData>,
        props: IGeoChartInnerProps,
    ): IGeoChartInnerOptions => {
        const { segment } = geoData;
        const { config: { colors = [], colorPalette = [], colorMapping = [] } = {}, dataView } = props;

        const dv = DataViewFacade.for(dataView!);
        const palette: IColorPalette = getValidColorPalette(colors, colorPalette);
        const colorStrategy: IColorStrategy = getColorStrategy(palette, colorMapping, geoData, dv);

        let categoryItems: IPushpinCategoryLegendItem[] = [];
        if (segment) {
            categoryItems = this.getCategoryLegendItems(colorStrategy);
        }

        return {
            geoData,
            categoryItems,
            colorStrategy,
            colorPalette: palette,
        };
    };

    private getCategoryLegendItems(colorStrategy: IColorStrategy): IPushpinCategoryLegendItem[] {
        return createCategoryLegendItems(colorStrategy, this.emptyHeaderString);
    }

    private validateData = (geoData: IGeoData, props: IGeoChartInnerProps): IValidationResult | undefined => {
        if (!props.dataView) {
            return;
        }
        const { dataView } = props;
        const limit = props.config?.limit ?? DEFAULT_DATA_POINTS_LIMIT;
        const dv = DataViewFacade.for(dataView!);

        return {
            isDataTooLarge: !isDataOfReasonableSize(dv, geoData, limit),
        };
    };

    private sanitizeProperties(): IGeoChartInnerProps {
        const { dataView } = this.props;

        fixEmptyHeaderItems(dataView!, `(${this.emptyHeaderString})`);

        return {
            ...this.props,
            dataView,
        };
    }
}

export function createCategoryLegendItems(
    colorStrategy: IColorStrategy,
    emptyHeaderString: string,
): IPushpinCategoryLegendItem[] {
    const colorAssignment: IColorAssignment[] = colorStrategy.getColorAssignment();
    return colorAssignment.map((item: IColorAssignment, legendIndex: number): IPushpinCategoryLegendItem => {
        const { name, uri } = isResultAttributeHeader(item.headerItem)
            ? item.headerItem.attributeHeaderItem
            : { name: emptyHeaderString, uri: emptyHeaderString };
        const color: string = colorStrategy.getColorByIndex(legendIndex);
        return {
            uri,
            name,
            color,
            legendIndex,
            isVisible: true,
        };
    });
}
