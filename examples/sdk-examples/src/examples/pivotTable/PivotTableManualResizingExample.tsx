// (C) 2020-2022 GoodData Corporation
import React, { Component } from "react";
import {
    PivotTable,
    IAllMeasureColumnWidthItem,
    IMeasureColumnWidthItem,
    IAttributeColumnWidthItem,
    newWidthForAttributeColumn,
    newWidthForSelectedColumns,
    newAttributeColumnLocator,
} from "@gooddata/sdk-ui-pivot";
import { modifyMeasure } from "@gooddata/sdk-model";
import * as Md from "../../md/full";
import { workspace } from "../../constants/fixtures";

const FranchiseFees = modifyMeasure(Md.$FranchiseFees, (m) => m.format("#,##0").title("Franchise Fees"));

const measures = [FranchiseFees];

const attributes = [Md.LocationState];

const columns = [Md.DateDatasets.Date.Quarter.Default];

const attributeWidth = (width: number) => newWidthForAttributeColumn(attributes[0], width);

const measureWidth = (width: number) =>
    newWidthForSelectedColumns(
        FranchiseFees,
        [
            newAttributeColumnLocator(
                Md.DateDatasets.Date.Quarter.Default,
                `/gdc/md/${workspace}/obj/2009/elements?id=1`,
            ),
        ],
        width,
    );

export class PivotTableManualResizingExample extends Component {
    public state = {
        columnWidths: [measureWidth(200), attributeWidth(200)],
    };

    public onButtonClick = (
        columnWidthItem: IAttributeColumnWidthItem | IMeasureColumnWidthItem | IAllMeasureColumnWidthItem,
    ): void => {
        this.setState({
            columnWidths: [columnWidthItem],
        });
    };

    public onColumnResized = (
        columnWidths: Array<IAttributeColumnWidthItem | IMeasureColumnWidthItem | IAllMeasureColumnWidthItem>,
    ): void => {
        this.setState({ columnWidths });
    };

    public render() {
        return (
            <div>
                <div>
                    <button
                        className="gd-button gd-button-secondary gd-button gd-button-secondary s-change-width-button-attribute"
                        onClick={() => this.onButtonClick(attributeWidth(400))}
                    >
                        Change Location State column width to 400
                    </button>
                    <button
                        className="gd-button gd-button-secondary gd-button gd-button-secondary s-change-width-button-measure"
                        onClick={() => this.onButtonClick(measureWidth(60))}
                    >
                        Change Q1 column width to 60
                    </button>
                    <button
                        className="gd-button gd-button-secondary gd-button gd-button-secondary s-change-width-button-remove"
                        onClick={() => this.setState({ columnWidths: [] })}
                    >
                        Remove column widths
                    </button>
                </div>
                <div
                    style={{ height: 300, marginTop: 20, resize: "both", overflow: "auto" }}
                    className="s-pivot-table-manual-resizing"
                >
                    <PivotTable
                        measures={measures}
                        rows={attributes}
                        columns={columns}
                        config={{
                            columnSizing: {
                                columnWidths: [...this.state.columnWidths],
                            },
                            menu: {
                                aggregations: true,
                                aggregationsSubMenu: true,
                            },
                        }}
                        pageSize={20}
                        onColumnResized={this.onColumnResized}
                    />
                </div>
            </div>
        );
    }
}

export default PivotTableManualResizingExample;
