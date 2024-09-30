import { Card } from "@mui/material";
import Navbar from "./components/navbar/Navbar";
import { useWindowDimensions } from "./components/hooks/useWindowDimensions";
import NewButton from "./components/explorer/newButton/NewButton";
import DrivePicker from "./components/explorer/drivePicker/DrivePicker";
import { useEffect, useState } from "react";
import CdbfsFolder from "./model/CdbfsFolder";
import CdbfsFile from "./model/CdbfsFile";
import HomePane from "./components/home/HomePane";
import { useUser } from "./components/hooks/useUser";
import { useClipboard } from "./components/hooks/useClipboard";
import DetailPane from "./components/detail/DetailPane";
import AccessRecord from "./model/AccessRecord";
import Explorer from "./components/explorer/Explorer";

export default function App() {

  const { maxComponentHeight } = useWindowDimensions();
  const { user } = useUser();
  const clipboard = useClipboard();

  const [file, setFile] = useState(null as any as CdbfsFile)
  const [breadcrumbs, setBreadCrumbs] = useState([] as CdbfsFolder[])
  const [accessRecord, setAccessRecord] = useState(undefined as any as AccessRecord)

  const folder = breadcrumbs.length === 0 ? undefined : breadcrumbs[breadcrumbs.length - 1]

  const reset = () => {
    setFile(undefined as any)
    setBreadCrumbs([])
    setAccessRecord(undefined as any)
    clipboard.setClipboard(undefined as any)
  }

  useEffect(() => {
    reset()
  }, [user])

  useEffect(() => {
    if (!accessRecord) reset()
    setBreadCrumbs([])
    setFile(undefined as any)
  }, [accessRecord])

  const navTo = (val: CdbfsFolder) => {
    breadcrumbs.push(val)
    setBreadCrumbs([...breadcrumbs])
    setFile(undefined as any)
  }

  const navUp = (levels: number) => {
    if (levels >= breadcrumbs.length) {
      setBreadCrumbs([])
    } else {
      for (let index = 0; index < levels; index++) { breadcrumbs.pop(); }
      setBreadCrumbs([...breadcrumbs])
    }
    setFile(undefined as any)
  }

  return (
    <>
      <Navbar />
      <div style={{ marginTop: "80px" }}>
        <div style={{ margin: "0 auto", width: "97%", height: maxComponentHeight, display: "flex" }} >
          <div style={{ width: "300px", marginRight: "20px" }}>
            <Card style={{ height: "100%", display: "flex", flexDirection: "column" }}>
              {user && <><div style={{ padding: "20px" }}>
                <NewButton folder={folder} record={accessRecord} />
              </div>
                <hr style={{ width: "90%", borderColor: "#7777", margin: "0 auto" }} /></>}
              <div style={{ flex: '1', padding: '20px', overflowY: "auto" }}>
                <DrivePicker drive={accessRecord?.drive} setRecord={setAccessRecord} />
              </div>
            </Card>
          </div>
          <div style={{ flex: "1" }}>
            {accessRecord?.drive ? <Explorer record={accessRecord} setFile={setFile} navTo={navTo} navUp={navUp} breadCrumbs={breadcrumbs} file={file} folder={folder} /> : <HomePane />}
          </div>
          {accessRecord?.drive && <div style={{ width: "300px", marginLeft: "20px" }}>
            <Card style={{ height: "100%" }}>
              <DetailPane record={accessRecord} file={file} folder={folder} navUp={() => { navUp(1) }} setFile={setFile} setFolder={(val: CdbfsFolder) => {
                breadcrumbs.pop();
                breadcrumbs.push(val);
                setBreadCrumbs([...breadcrumbs])
              }} />
            </Card>
          </div>}
        </div>
      </div >
    </>
  )
}
