"use client";

import React, { useState } from "react";
import * as minio from "minio";

type TBucketType = {
  name: string;
  value: string;
};

interface FileList {
  name: string;
  size: number;
}

interface UploadFilesState {
  files: FileList[];
}

const buckets: TBucketType[] = [
  {
    name: "MAC",
    value: "mac",
  },
  {
    name: "IPAD",
    value: "ipad",
  },
  {
    name: "IPHONE",
    value: "iphone",
  },
  {
    name: "WATCH",
    value: "watch",
  },
  {
    name: "AIRPODS",
    value: "airpods",
  },
  {
    name: "ACCESSORIES",
    value: "accessories",
  },
  {
    name: "SAMSUNG",
    value: "samsung",
  },
  {
    name: "AUDIO SYSTEMS",
    value: "audioSystems",
  },
];

const SubmitForm = () => {
  const [selectedFiles, setSelectedFiles] = React.useState<UploadFilesState>({
    files: [],
  });
  const [selectedBucket, setSelectedBucket] = useState<string>("");
  const [text, setText] = React.useState<string>("");

  const selectFile = (e: React.ChangeEvent<HTMLInputElement>) => {
    const filesInput: any = e.target.files;
    setSelectedFiles({
      files: [...selectedFiles.files, ...filesInput],
    });
  };

  React.useEffect(() => {
    console.log(selectedFiles);
  }, [selectedFiles]);

  function uploadFile() {
    const client = new minio.Client({
      endPoint: "127.0.0.1",
      port: 9000,
      useSSL: false,
      accessKey: "xTa9bt9XQKLEaEKfGeHq",
      secretKey: "Tj4USMPM8x8yOnQWybHOx9KCgqnx9WKErSBl5O1S",
    });

    const metaData = {
      "Content-Type": "application/octet-stream",
    };

    selectedFiles.files.map((file: any) => {
      client.putObject(
        selectedBucket,
        file.name,
        metaData["Content-Type"],
        file,
        (err: string, result: string) => {
          if (!file) {
            return setText("Please select file");
          } else {
            if (err) {
              console.error(err);
              setText(err);
              setTimeout(() => setText(""), 6000);
            } else {
              setText(
                `${selectedFiles.files.length} ${
                  selectedFiles.files.length === 1 ? "File" : "File's"
                } succesful uploaded to "${selectedBucket}" bucket`
              );
              setTimeout(() => setText(""), 6000);
              console.log(
                `${selectedFiles.files.length} ${
                  selectedFiles.files.length === 1 ? "File" : "File's"
                } succesful uploaded to "${selectedBucket}" bucket`
              );
            }
          }
        }
      );
    });
  }

  return (
    <div className="flex flex-col gap-4">
      <h1>Upload File to Minio</h1>
      <div className="flex flex-col gap-y-2">
        <p>Select bucket:</p>
        <div className="flex flex-row gap-x-4">
          {buckets.map((bucketItem) => (
            <button
              key={bucketItem.name}
              value={bucketItem.value}
              className={`px-4 translate-y-0 transition-all ${
                bucketItem.value === selectedBucket
                  ? "bg-[#2e2e2e] scale-110"
                  : "bg-transparent"
              }`}
              onClick={() => setSelectedBucket(bucketItem.value)}
            >
              {bucketItem.name}
            </button>
          ))}
        </div>
      </div>
      <input type="file" onChange={selectFile} multiple />

      <button type="button" onClick={() => uploadFile()}>
        Upload
      </button>
      <span className="text-[green]">{text}</span>
    </div>
  );
};

export default SubmitForm;
