import React, { useEffect, useState } from "react";
import styles from "../../styles/share/newShare.module.css";
import { Stack, Box, TextField } from "@mui/material";
import { useNavigate, useParams } from "react-router-dom";
import axios from "axios";
import { API_BASE_URL } from "../../app-config";

const ShareEdit = ({ insertShare }) => {
  const fileList = []; // 이미지 + 첨부파일
  const [singleImage, setSingleImage] = useState(); //이미지
  const [multiFiles, setMultiFiles] = useState([]); //첨부파일
  const [fileNameInput, setFileNameInput] = useState([]); //첨부파일 이름
  const navigate = useNavigate();
  const [share, setShare] = useState({});
  const { shareIdx } = useParams();
  const [titleValue, setTitleValue] = useState("");
  const [contentValue, setContentValue] = useState("");

  useEffect(() => {
    //share 데이터요청
    axios
      .get(API_BASE_URL + "/community/share/shareDetail?shareIdx=" + shareIdx)
      .then((responseShare) => {
        setShare(responseShare.data);
      });
  }, [shareIdx]);

  useEffect(() => {
    if (Object.keys(share).length !== 0) {
      setContentValue(share.shareContent);
      setTitleValue(share.shareTitle);

      //현재 접속 유저정보요청
      axios
        .get(API_BASE_URL + "/user/getUser", {
          headers: {
            Authorization: "Bearer " + sessionStorage.getItem("ACCESS_TOKEN"),
          },
        })
        .then((response) => {
          if (response.data.user === null) {
            alert("로그인 후 수정할 수 있습니다.");
            navigate("/login");
          } else if (response.data.user.userId !== share.user.userId) {
            alert("본인이 작성한 글만 수정할 수 있습니다.");
            navigate(-1);
          }
        });
    }
  }, [share]);

  const handleTitleValue = (e) => {
    setTitleValue(e.target.value);
  };

  const handleContentValue = (value) => {
    setContentValue(value);
  };

  const handleSubmit = (e) => {
    let share = new FormData(e.target);
    e.preventDefault();
    share.set("shareIdx", share.shareIdx);
    share.set("shareRegDate", share.shareRegDate);

    insertShare(share);

    const formObj = {};

    // key 설정
    share.forEach((value, key) => {
      if (key === "shareTitle" || key === "shareContent") formObj[key] = value;
    });
    //console.log(singleImage);
    fileList.push(singleImage);
    //console.log(multiFiles);
    multiFiles.forEach((file) => {
      fileList.push(file);
    });

    formObj.uploadFiles = fileList;

    console.log(formObj);

    insertShare(formObj);
  };

  const readImage = (file) => {
    // 인풋 태그에 파일이 있는 경우
    if (file) {
      // FileReader 인스턴스 생성
      const reader = new FileReader();

      // 이미지가 로드가 된 경우
      reader.onload = (e) => {
        const preImg = document.getElementById("shareImgPreview");
        preImg.src = e.target.result;
      };

      reader.readAsDataURL(file);
      console.log(file);
      setSingleImage((prev) => file);
    }
  };

  const handleFileChange = (e) => {
    // 여러개 파일 선택시 하나로 나눠서 배열 담음
    const tempList = Array.prototype.slice.call(e.target.files);
    // 첨부파일 이름
    const newFileNameInput = [];

    const newFiles = [];
    tempList.forEach((file) => {
      //console.log(file.name);
      newFileNameInput.push(file.name);
      newFiles.push(file);
      //console.log(newFileNameInput);
    });
    setFileNameInput((prev) => [...newFileNameInput]);
    setMultiFiles((prev) => [...newFiles]);
  };

  //FileNameInput 파일 수 만큼 생성
  useEffect(() => {
    if (fileNameInput.length > 0) {
      fileNameInput.forEach((fileInput, index) => {
        document.getElementById(`uploadFileName${index}`).value = fileInput;
      });
    }
  }, [fileNameInput]);

  return (
    <form id="insertShareForm" onSubmit={handleSubmit}>
      <div className={styles.regBox}>
        <div className={styles.imgBox}>
          <img
            style={{ cursor: "pointer" }}
            className={styles.itemImg}
            src={`/upload/share/newShareImg.png`}
            alt="img"
            id="shareImgPreview"
            title="사진을 추가하려면 클릭하세요."
            onClick={() => {
              document.getElementById("fileInput").click();
            }}
          />
          <input
            hidden
            type="file"
            accept="image/*"
            id="fileInput"
            name="shareImgName"
            onChange={(e) => {
              readImage(e.target.files[0]);
            }}
          />
          <div className={styles.fileloadBtn}>
            <div className={styles.regBoxBottom}>
              <Stack
                direction="row"
                alignItems="center"
                spacing={2}
                style={{ display: "block" }}
              >
                <div>
                  {fileNameInput.length !== 0 ? (
                    fileNameInput.map((fileName, index) => (
                      <input
                        className={styles.uploadFileName}
                        defaultValue={fileName}
                        placeholder="첨부파일"
                        id={`uploadFileName${index}`}
                        key={index}
                      />
                    ))
                  ) : (
                    <input
                      className={styles.uploadFileName}
                      defaultValue="첨부파일"
                      placeholder="첨부파일"
                      id="uploadFileName"
                    />
                  )}
                </div>
                <div>
                  <label htmlFor="fileUpload" style={{ marginLeft: "250px" }}>
                    파일첨부
                  </label>
                </div>
                <input
                  type="file"
                  multiple={true}
                  onChange={handleFileChange}
                  id="fileUpload"
                  name="shareFileName"
                />
              </Stack>
            </div>
          </div>
        </div>

        <div className={styles.shareForm}>
          <Box
            sx={{
              "& .MuiOutlinedInput-root": {
                "&.Mui-focused fieldset": {
                  borderColor: "#8cbf75",
                },
              },
            }}
            noValidate
            autoComplete="off"
          >
            <TextField
              id="shareTitleInput"
              label="제목"
              variant="outlined"
              name="shareTitle"
              value={titleValue || ""}
              onChange={handleTitleValue}
              style={{ marginLeft: "9px", width: "100%" }}
              sx={{
                "& .MuiOutlinedInput-root": {
                  "&.Mui-focused fieldset": {
                    borderColor: "#8cbf75",
                  },
                },
                "& .MuiInputLabel-root": {
                  "&.Mui-focused": {
                    color: "#1d5902",
                  },
                },
              }}
            />
          </Box>
          <Box
            sx={{
              "& .MuiTextField-root": { m: 1, width: "750px" },
            }}
            noValidate
            autoComplete="off"
          >
            <TextField
              id="shareContentInput"
              label="내용"
              value={contentValue || ""}
              onChange={handleContentValue}
              multiline
              rows={15}
              name="shareContent"
              style={{ marginLeft: "9px", width: "100%" }}
              sx={{
                "& .MuiOutlinedInput-root": {
                  "&.Mui-focused fieldset": {
                    borderColor: "#8cbf75",
                  },
                },
                "& .MuiInputLabel-root": {
                  "&.Mui-focused": {
                    color: "#1d5902",
                  },
                },
              }}
            />
          </Box>
          <Box
            sx={{
              "& > :not(style)": { m: 1, width: "750px" },
            }}
            noValidate
            autoComplete="off"
          ></Box>

          <div className={styles.shareBtns}>
            <button
              className={styles.cancelBtn}
              type="button"
              onClick={() => {
                navigate(-1);
              }}
            >
              취소
            </button>
            <button className={styles.RegBtn} type="submit">
              수정
            </button>
          </div>
        </div>
      </div>
    </form>
  );
};

export default ShareEdit;