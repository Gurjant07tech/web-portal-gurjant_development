import { Tabs, Space } from "antd";
import { useSelector, useDispatch } from "react-redux";
import ParticipantProfile from "../ParticipantProfile/ParticipantProfile";
import "./CaseloadTabsCustom.css";
import { setActiveParticipant } from "features/common/commonSlice";
import { useEffect, useState } from "react";

const { TabPane } = Tabs;

const CaseloadTabs = () => {
  let [dataObj, setDataObj] = useState();

  const dispatch = useDispatch();

  const caseloadData = useSelector(
    (state) => state.caseloadData.caseloadDataObj
  );

  const { searchDataObj, topSearchQueryValue } = useSelector(
    (state) => state.searchData
  );

  const { activeParticipantId } = useSelector((state) => state.common);

  const handleChange = (participantId) => {
    dispatch(setActiveParticipant(participantId));
  };

 
  useEffect(()=>{
    if (topSearchQueryValue) {
      setDataObj(searchDataObj);
      if(searchDataObj?.length > 0){
        dispatch(setActiveParticipant(searchDataObj[0].id));
      }
    } else {
      setDataObj(caseloadData);
    }
  }, [topSearchQueryValue])
   


  if (dataObj?.length === 0)
    return (
      <Space>
        <h2>No Data Found</h2>
      </Space>
    );

  return (
    <Tabs
      defaultActiveKey={activeParticipantId}
      tabPosition="left"
      onChange={(e) => handleChange(e)}
      destroyInactiveTabPane
    >
      {dataObj?.map((userObj, index) => (
        <TabPane tab={`${userObj.fullName}`} key={userObj.id}>
          <ParticipantProfile/>
        </TabPane>
      ))}
    </Tabs>
  );
};

export default CaseloadTabs;
