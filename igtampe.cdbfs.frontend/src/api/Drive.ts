import CdbfsDrive from "../model/CdbfsDrive";
import DriveRequest from "../model/requests/DriveRequest";
import { API_PREFIX, Delete, Get , Post, Put} from "./Common";

const DRIVE_URL = API_PREFIX + "drives/"

export const getDrives = (
    setLoading:(value:boolean)=>void,
    setItem:(value?:CdbfsDrive[]) => void,
    onError:(value:any)=>void
) => Get(setLoading,setItem,onError,DRIVE_URL)

export const formatDrive = (
    setLoading:(value:boolean)=>void,
    onSuccess:() => void,
    onError:(value:any)=>void,
    request: DriveRequest
) => Put(setLoading,onSuccess,onError,DRIVE_URL+ "format",request)

export const createDrive = (
    setLoading:(value:boolean)=>void,
    onSuccess:() => void,
    onError:(value:any)=>void,
    request : DriveRequest
) => Post(setLoading,onSuccess,onError,DRIVE_URL,request)

export const updateDrive = (
    setLoading:(value:boolean)=>void,
    onSuccess:() => void,
    onError:(value:any)=>void,
    request : DriveRequest
) => Put(setLoading,onSuccess,onError,DRIVE_URL,request)

export const deleteDrive = (
    setLoading:(value:boolean)=>void,
    onSuccess:() => void,
    onError:(value:any)=>void,
    request : DriveRequest
) => Delete(setLoading,onSuccess,onError,DRIVE_URL,request)

