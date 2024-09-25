import CdbfsFile from "../model/CdbfsFile";
import FileRequest from "../model/requests/FileRequest";
import { API_PREFIX, Delete, Get , Post, Put, Upload} from "./Common";

const FILE_URL = API_PREFIX + "files/"

export const getFile = (
    setLoading:(value:boolean)=>void,
    setItem:(value?:CdbfsFile) => void,
    onError:(value:any)=>void,
    id: number,
) => Get(setLoading,setItem,onError,FILE_URL + id)

export const createFile = (
    setLoading:(value:boolean)=>void,
    setProgress:(value:number)=>void,
    onSuccess:() => void,
    onError:(value:any)=>void,
    request : FileRequest,
    file : File
) => Upload(setLoading,setProgress,onSuccess,onError,"POST",FILE_URL,file,request)

export const copyFile = (
    setLoading:(value:boolean)=>void,
    onSuccess:() => void,
    onError:(value:any)=>void,
    request : FileRequest
) => Post(setLoading,onSuccess,onError,FILE_URL + "copy",request)

export const updateFile = (
    setLoading:(value:boolean)=>void,
    setProgress:(value:number)=>void,
    onSuccess:() => void,
    onError:(value:any)=>void,
    request : FileRequest,
    file : File
) => Upload(setLoading,setProgress,onSuccess,onError,"PUT",FILE_URL,file,request)

export const renameFile = (
    setLoading:(value:boolean)=>void,
    onSuccess:() => void,
    onError:(value:any)=>void,
    request : FileRequest
) => Put(setLoading,onSuccess,onError,FILE_URL+ "rename",request)

export const moveFile = (
    setLoading:(value:boolean)=>void,
    onSuccess:() => void,
    onError:(value:any)=>void,
    request : FileRequest
) => Put(setLoading,onSuccess,onError,FILE_URL + "move",request)

export const deleteFile = (
    setLoading:(value:boolean)=>void,
    onSuccess:() => void,
    onError:(value:any)=>void,
    request : FileRequest
) => Delete(setLoading,onSuccess,onError,FILE_URL,request)

