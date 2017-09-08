<template>
    <div class="full-width-panel">
        <ag-grid-vue :ref="'detail'" class="full-width-grid"
                     :gridOptions="gridOptions"

                     :enableSorting="true"
                     :enableFilter="true"
                     :enableColResize="true">
        </ag-grid-vue>
    </div>
</template>

<script>
    import {AgGridVue} from "ag-grid-vue";

    export default ({
        data () {

            return {
                gridOptions: null,
                parentRecord: null,
                parentRecordImage: null
            }

        },
        components: {
            'ag-grid-vue': AgGridVue
        },
        methods: {

            createColumnDefs() {
                return [
                    {headerName: 'Call ID', field: 'callId', cellClass: 'call-record-cell'},
                    {headerName: 'Direction', field: 'direction', cellClass: 'call-record-cell'},
                    {headerName: 'Number', field: 'number', cellClass: 'call-record-cell'},
                    {
                        headerName: 'Duration',
                        field: 'duration',
                        cellClass: 'call-record-cell',
                        valueFormatter: this.secondCellFormatter
                    },
                    {headerName: 'Switch', field: 'switchCode', cellClass: 'call-record-cell'}
                ];
            },

            secondCellFormatter(params) {
                return params.value.toLocaleString() + 's';
            },

            consumeMouseWheelOnDetailGrid($event) {
                $event.stopPropagation();
            }

        },
        beforeMount() {
            this.gridOptions = {};
            this.gridOptions.columnDefs = this.createColumnDefs();
        },
        // created() {
        //     this.parentRecord = this.params.node.parent.data;
        //     this.parentRecordImage = `../../images/${this.parentRecord.image}.png`;
        // },
        mounted() {
            this.gridOptions.api.setRowData(this.parentRecord.callRecords);
            this.gridOptions.api.sizeColumnsToFit();
            this.$refs.detail.$el.addEventListener('mousewheel', this.consumeMouseWheelOnDetailGrid)
        },
        destroyed() {
            if(this.$refs.detail) {
                this.$refs.detail.$el.removeEventListener('mousewheel', this.consumeMouseWheelOnDetailGrid)
            }
        }
    })
</script>

<style scoped>
    .full-width-panel {
        position: relative;
        background: #fafafa;
        height: 100%;
        width: 100%;
        padding: 5px;
        box-sizing: border-box;
        border-left: 2px solid grey;
        border-bottom: 2px solid lightgray;
        border-right: 2px solid lightgray;
    }

    .call-record-cell {
        text-align: right;
    }

    .full-width-detail {
        padding-top: 4px;
    }

    .full-width-details {
        float: left;
        padding: 5px;
        margin: 5px;
        width: 150px;
    }

    .full-width-grid {
        margin-left: 150px;
        padding-top: 25px;
        box-sizing: border-box;
        display: block;
        height: 100%;
    }

    .full-width-grid-toolbar {
        top: 4px;
        left: 30px;
        margin-left: 150px;
        display: block;
        position: absolute;
    }

    .full-width-phone-icon {
        padding-right: 10px;
    }

    .full-width-search {
        border: 1px solid #eee;
        margin-left: 10px;
    }
</style>
