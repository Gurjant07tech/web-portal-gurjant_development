import React from "react";
import { useSelector } from "react-redux";
import { Collapse } from "antd";
import SelectSearchAntd from "components/SelectSearchAntd/SelectSearchAntd";
import { getOffsetsTz, getUserTz } from "utils";
import FullName from "components/FullName/FullName";

const { Panel } = Collapse;

const UserIdentity = () => {
  const { userData } = useSelector((state) => state.login);

  return (
    <Collapse defaultActiveKey={["1"]} style={{ margin: "30px 0" }}>
      <Panel header="User Identity" key="1">
        <SelectSearchAntd
          label="Time Zone"
          optionsArr={getOffsetsTz()}
          defaultValue={getUserTz()}
        />
        <FullName defaultValue={{ ...userData }} />
      </Panel>
    </Collapse>
  );
};

export default UserIdentity;
