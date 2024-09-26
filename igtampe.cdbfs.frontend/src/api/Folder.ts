import CdbfsDirectory from "../model/CdbfsDirectory";
import FolderRequest from "../model/requests/FolderRequest";
import { API_PREFIX, Delete, Get, Post, Put } from "./Common";

const FOLDER_URL = API_PREFIX + "folder/"

export const getDirectory = (
    setLoading: (value: boolean) => void,
    setItem: (value?: CdbfsDirectory) => void,
    onError: (value: any) => void,
    drive: number,
    folder?: number,
) => Get(setLoading, setItem, onError, FOLDER_URL + "dir/" + drive + (folder ? `/${folder}` : ''))

export const createFolder = (
    setLoading: (value: boolean) => void,
    onSuccess: () => void,
    onError: (value: any) => void,
    request: FolderRequest
) => Post(setLoading, onSuccess, onError, FOLDER_URL, request)

export const copyFolder = (
    setLoading: (value: boolean) => void,
    onSuccess: () => void,
    onError: (value: any) => void,
    request: FolderRequest
) => Post(setLoading, onSuccess, onError, FOLDER_URL + "copy", request)

export const updateFolder = (
    setLoading: (value: boolean) => void,
    onSuccess: () => void,
    onError: (value: any) => void,
    request: FolderRequest
) => Put(setLoading, onSuccess, onError, FOLDER_URL, request)

export const moveFolder = (
    setLoading: (value: boolean) => void,
    onSuccess: () => void,
    onError: (value: any) => void,
    request: FolderRequest
) => Put(setLoading, onSuccess, onError, FOLDER_URL + "move", request)

export const deleteFolder = (
    setLoading: (value: boolean) => void,
    onSuccess: () => void,
    onError: (value: any) => void,
    request: FolderRequest
) => Delete(setLoading, onSuccess, onError, FOLDER_URL, request)

