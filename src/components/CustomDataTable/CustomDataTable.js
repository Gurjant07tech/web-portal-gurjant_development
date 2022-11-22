import { Table } from "antd";
import { setSelectedEvents } from "features/common/commonSlice";
import { useState} from "react";
import { useDispatch } from "react-redux";
import "./CustomDataTable.css";
const CustomDataTable = ({
  columns,
  data,
  position,
  showSelect,
  showPagination,
  tableSource,
  className
}) => {
  const dispatch = useDispatch();
  const [selectedRowKeys, setSelectedRowKeys] = useState([]);
  
  const onSelectChange = (selectedRowKeys) => {
    setSelectedRowKeys(selectedRowKeys);
    
    let selectedNewEvents = [];

    if(tableSource === "events"){
      selectedRowKeys.map((key) => {
        selectedNewEvents.push(data[key].id);
      })
      dispatch(setSelectedEvents(selectedNewEvents));
    }
  };
  const rowSelection = {
    selectedRowKeys,
    onChange: onSelectChange,
    selections: [
      Table.SELECTION_ALL,
      Table.SELECTION_INVERT,
      Table.SELECTION_NONE,
      {
        key: "odd",
        text: "Select Odd Row",
        onSelect: (changableRowKeys) => {
          let newSelectedRowKeys = [];
          newSelectedRowKeys = changableRowKeys.filter((key, index) => {
            if (index % 2 !== 0) {
              return false;
            }
            return true;
          });
          setSelectedRowKeys(newSelectedRowKeys);
        },
      },
      {
        key: "even",
        text: "Select Even Row",
        onSelect: (changableRowKeys) => {
          let newSelectedRowKeys = [];
          newSelectedRowKeys = changableRowKeys.filter((key, index) => {
            if (index % 2 !== 0) {
              return true;
            }
            return false;
          });
          setSelectedRowKeys(newSelectedRowKeys);
        },
      },
    ],
  };

  return (
    <Table
      rowSelection={showSelect ? rowSelection : showSelect}
      columns={columns}
      dataSource={data}
      className={className}
      position={position}
      pagination={
        showPagination
          ? {
              showSizeChanger: true,
              pageSize: 100,
              showTotal: (total, range) =>
                `${range[0]}-${range[1]} of ${total} items`,
            }
          : false
      }
      scroll={{ y: 590 }}
    />
  );
};

export default CustomDataTable;
