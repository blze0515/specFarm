import React, { useEffect, useState } from "react";
import styles from "../../styles/share/newShare.module.css";
import { Stack, Box, TextField } from "@mui/material";
import { useNavigate } from "react-router-dom";
import { API_BASE_URL } from "../../app-config";
import axios from "axios";

const NewShare = () => {
  const fileList = [];
  const [singleImage, setSingleImage] = useState(); //이미지
  const [multiFiles, setMultiFiles] = useState([]); //첨부파일
  const [fileNameInput, setFileNameInput] = useState([]); //첨부파일 이름
  const navigate = useNavigate();

  const insertShare = (share) => {
    axios({
      method: "post",
      url: API_BASE_URL + "/community/share/newShare",
      headers: {
        "Content-Type": "multipart/form-data",
        Authorization: "Bearer " + sessionStorage.getItem("ACCESS_TOKEN"),
      },
      data: share,
    })
      .then((response) => {
        navigate(`../${response.data.shareIdx}`);
      })
      .catch((e) => {
        console.log(e);
      });
  };

  const handleSubmit = (e) => {
    e.preventDefault();

    let share = new FormData(e.target);

    const formObj = {};

    share.forEach((value, key) => {
      if (key === "shareTitle" || key === "shareContent") formObj[key] = value;
    });
    console.log(singleImage);
    fileList.push(singleImage);
    console.log(multiFiles);
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
            src="https://cdn.pixabay.com/photo/2022/08/18/09/20/houses-7394390__340.jpg"
            /**src={`http:localhost:8080/upload/${shareImgName}`} */
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
            id="fileInput"
            name="shareImgName"
            onChange={(e) => {
              readImage(e.target.files[0]);
            }}
          />
          <div className={styles.fileloadBtn}>
            <div className={styles.regBoxBottom}>
              <Stack direction="row" alignItems="center" spacing={2}>
                {fileNameInput.length !== 0 ? (
                  fileNameInput.map((fileName, index) => (
                    <input
                      className={styles.uploadFileName}
                      value="첨부파일"
                      placeholder="첨부파일"
                      id={`uploadFileName${index}`}
                      key={index}
                      style={{ display: "block" }}
                    />
                  ))
                ) : (
                  <input
                    className={styles.uploadFileName}
                    value="첨부파일"
                    placeholder="첨부파일"
                    id="uploadFileName"
                  />
                )}

                <label for="fileUpload" style={{ marginLeft: "0px" }}>
                  파일첨부
                </label>
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
              등록
            </button>
          </div>
        </div>
      </div>
    </form>
  );
  //<ShareForm addNewShare={addNewShareHandler}/>
};

export default NewShare;
