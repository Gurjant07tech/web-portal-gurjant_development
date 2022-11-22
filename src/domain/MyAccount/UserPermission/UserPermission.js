import React, { useEffect, useState } from "react";
import { useSelector } from "react-redux";
import { Collapse } from "antd";
import SelectAntd from "components/SelectAntd/SelectAntd";
import apiHandler from "api";
import endpoint from "api/endpoint";

const { Panel } = Collapse;

const UserPermission = () => {
  const { userData, authToken } = useSelector((state) => state.login);
  const { role, status, agencies: websiteUserAgencies } = userData;

  const agencies = useSelector((state) => state.caseload.agencies);

  const [websiteUsers, setWebsiteUsers] = useState();

  useEffect(() => {
    apiHandler({ url: endpoint.WEBSITE_USER_TYPES, authToken }).then((result) =>
      setWebsiteUsers(result.data)
    );
  }, []);

  return (
    <Collapse defaultActiveKey={["3"]} style={{ margin: "30px 0" }}>
      <Panel header="User Permissions" key="3">
        <SelectAntd
          label="Website User Type"
          optionsArr={websiteUsers}
          defaultValue={role}
        />
        <SelectAntd
          label="State"
          optionsArr={[
            { id: "111", name: "ACTIVE" },
            { id: "112", name: "EXPIRED" },
            { id: "113", name: "ARCHIVED" },
          ]}
          defaultValue={status}
        />
        <SelectAntd
          label="TRAC Agencies"
          placeholder="Select Agency"
          defaultValue={websiteUserAgencies[0].name}
          optionsArr={agencies}
        />
      </Panel>
    </Collapse>
  );
};

export default UserPermission;
