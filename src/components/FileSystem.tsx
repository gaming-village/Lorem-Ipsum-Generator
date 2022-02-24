import React, { useEffect, useState } from 'react';
import "../css/file-system.css";

interface FileInfo {
   name: string;
   extension: "exe";
   clickEvent?: () => void;
}

export let createFile: (info: FileInfo) => void;

const fileBuffer = new Array<FileInfo>();
const FileSystem = () => {
   const [files, setFiles] = useState<Array<FileInfo>>(new Array<FileInfo>());

   useEffect(() => {
      createFile = (info: FileInfo): void => {
         fileBuffer.push(info);
         const newArr = fileBuffer.slice();
         setFiles(newArr);
      };
   });

   return <div id="file-system">
      {files.map((fileInfo, i) => {
         let iconSrc;
         switch (fileInfo.extension) {
            case "exe": {
               iconSrc = require("../images/icons/program.png").default;
               break;
            }
         }

         return <div key={i} onDoubleClick={fileInfo.clickEvent ? () => fileInfo.clickEvent!() : undefined} className="file">
            <img src={iconSrc} alt="" className="icon" />

            <span>{fileInfo.name}.{fileInfo.extension}</span>
         </div>;
      })}
   </div>;
}

export default FileSystem;