import AccessRecord from "../model/AccessRecord";
import { API_PREFIX, Delete, Get , Post, Put} from "./Common";

const ACCESS_URL = API_PREFIX + "access/"

export const myAccess = (
    setLoading:(value:boolean)=>void,
    setItem:(value?:AccessRecord[]) => void,
    onError:(value:any)=>void
) => Get(setLoading,setItem,onError,ACCESS_URL)

export const driveAccess = (
    setLoading:(value:boolean)=>void,
    setItem:(value?:AccessRecord[]) => void,
    onError:(value:any)=>void,
    drive:number
) => Get(setLoading,setItem,onError,ACCESS_URL + drive)

export const addAccess = (
    setLoading:(value:boolean)=>void,
    onSuccess:() => void,
    onError:(value:any)=>void,
    record : AccessRecord
) => Post(setLoading,onSuccess,onError,ACCESS_URL,record)

export const updateAccess = (
    setLoading:(value:boolean)=>void,
    onSuccess:() => void,
    onError:(value:any)=>void,
    record : AccessRecord
) => Put(setLoading,onSuccess,onError,ACCESS_URL,record)

export const removeAccess = (
    setLoading:(value:boolean)=>void,
    onSuccess:() => void,
    onError:(value:any)=>void,
    record : AccessRecord
) => Delete(setLoading,onSuccess,onError,ACCESS_URL,record)

