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
import useApi from "./components/hooks/useApi";
import { getStatistics } from "./api/FIle";
import CdbfsStatistics from "./model/CdbfsStatistics";
import { CSSTransition, TransitionGroup } from "react-transition-group";
import "./app.css"

export default function App() {

  const { maxComponentHeight } = useWindowDimensions();
  const { user } = useUser();
  const clipboard = useClipboard();

  const [cachedStats, setCachedStats] = useState(undefined as CdbfsStatistics | undefined)

  //The App will only take care of this one thing.  
  const statisticsApi = useApi(getStatistics, true, setCachedStats)


  const [file, setFile] = useState(null as any as CdbfsFile)
  const [breadcrumbs, setBreadCrumbs] = useState([] as CdbfsFolder[])
  const [accessRecord, setAccessRecord] = useState(undefined as any as AccessRecord)

  const folder = breadcrumbs.length === 0 ? undefined : breadcrumbs[breadcrumbs.length - 1]

  const reset = () => {
    setFile(undefined as any)
    setBreadCrumbs([])
    setAccessRecord(undefined as any)
    statisticsApi.fetch(setCachedStats);
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

          <TransitionGroup component={null}>
            {cachedStats && <CSSTransition timeout={500} classNames="drivePicker">
              <div style={{}}>
                <Card style={{ height: "100%", display: "flex", flexDirection: "column" }}>
                  {user && <><div style={{ padding: "20px" }}>
                    <NewButton folder={folder} record={accessRecord} />
                  </div>
                    <hr style={{ width: "90%", borderColor: "#7777", margin: "0 auto" }} /></>}
                  <div style={{ flex: '1', padding: '20px', overflowY: "auto" }}>
                    <DrivePicker drive={accessRecord?.drive} setRecord={setAccessRecord} />
                  </div>
                </Card>
              </div></CSSTransition>}
          </TransitionGroup>

          <div style={{ flex: "1" }}>
            {accessRecord?.drive
              ? <Explorer record={accessRecord} setFile={setFile} navTo={navTo} navUp={navUp} breadCrumbs={breadcrumbs} file={file} folder={folder} />
              : <HomePane statistics={cachedStats} />}
          </div>

          <TransitionGroup component={null}>
            {accessRecord?.drive && <CSSTransition timeout={500} classNames="detailsPane">
              <div>
                <Card style={{ height: "100%" }}>
                  <DetailPane record={accessRecord} file={file} folder={folder} navUp={() => { navUp(1) }} setFile={setFile} setFolder={(val: CdbfsFolder) => {
                    breadcrumbs.pop();
                    breadcrumbs.push(val);
                    setBreadCrumbs([...breadcrumbs])
                  }} />
                </Card>
              </div>
            </CSSTransition>}
          </TransitionGroup>


        </div>
      </div >
    </>
  )
}
