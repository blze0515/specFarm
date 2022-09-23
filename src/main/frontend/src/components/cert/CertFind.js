import React, { useEffect, useState } from "react";
import styles from "../../styles/cert/CertFind.module.css";
import Grid from "@mui/system/Unstable_Grid";
import FormControl from "@mui/material/FormControl";
import InputLabel from "@mui/material/InputLabel";
import Select from "@mui/material/Select";
import MenuItem from "@mui/material/MenuItem";
import SearchIcon from "@mui/icons-material/Search";
import Tabs from "@mui/material/Tabs";
import Tab from "@mui/material/Tab";
import Box from "@mui/material/Box";
import ApplicationCaution from "./ApplicationCaution";
import ApplicationInfo from "./ApplicationInfo";
import BasicsInfo from "./BasicsInfo";
import TestSchedule from "./TestSchedule";
import FavoriteBorder from "@mui/icons-material/FavoriteBorder";
import Favorite from "@mui/icons-material/Favorite";
import Checkbox from "@mui/material/Checkbox";
import TextField from "@mui/material/TextField";
import "../../styles/cert/info.css";
import { API_BASE_URL } from "../../app-config";
import axios from "axios";

function TabPanel(props) {
  const { children, value, index, ...other } = props;

  return (
    <div
      role="tabpanel"
      hidden={value !== index}
      id={`simple-tabpanel-${index}`}
      aria-labelledby={`simple-tab-${index}`}
      {...other}
    >
      {value === index && (
        <Box sx={{ p: 3 }}>
          <div>{children}</div>
        </Box>
      )}
    </div>
  );
}

function a11yProps(index) {
  return {
    id: `simple-tab-${index}`,
    "aria-controls": `simple-tabpanel-${index}`,
  };
}

const CertFind = () => {
  const [value, setValue] = React.useState(0);
  const [certLList, setCertLList] = useState([]);
  const [certL, setCertL] = useState("");
  const [certMList, setCertMList] = useState([]);
  const [certM, setCertM] = useState("");
  const [certSList, setCertSList] = useState([]);
  const [testList, setTestList] = useState([]);

  const handleClick = (e) => {
    axios({
      url: API_BASE_URL + "/cert/getCertTest",
      method: "get",
      params: { jmcd: e.target.value },
    }).then((response) => {
      setTestList(response.data.testList);
    });
  };

  useEffect(() => {
    axios({
      url: API_BASE_URL + "/cert/getCertLList",
      method: "get",
    }).then((response) => {
      console.log(response.data.certLList);
      setCertLList(response.data.certLList);
    });
  }, []);

  const certLCatChange = (e) => {
    setCertL((prev) => e.target.value);
  };

  useEffect(() => {
    console.log(certL);
    if (certL !== "" && typeof certL !== "undefined") {
      axios({
        url: API_BASE_URL + "/cert/getCertMList",
        method: "get",
        params: { obligfldnm: certL },
      }).then((response) => {
        setCertMList(response.data.certMList);
      });
    }
  }, [certL]);

  const certMCatChange = (e) => {
    console.log(e.target.value);
    setCertM(e.target.value);
  };

  useEffect(() => {
    console.log(certM);
    if (certM !== "" && typeof certM !== "undefined") {
      axios({
        url: API_BASE_URL + "/cert/getCertSList",
        method: "get",
        params: { mdobligfldnm: certM },
      }).then((response) => {
        setCertSList(response.data.certSList);
      });
    }
  }, [certM]);

  useEffect(() => {
    console.log(certM);
    if (certM !== "" && typeof certM !== "undefined") {
      axios({
        url: API_BASE_URL + "/cert/getCertSList",
        method: "get",
        params: { mdobligfldnm: certM },
      }).then((response) => {
        console.log(response.data);
        setCertSList(response.data.certSList);
      });
    }
  }, [certM]);

  const handleChange = (event, newValue) => {
    setValue(newValue);
  };

  const label = { inputProps: { "aria-label": "Checkbox demo" } };

  // useEffect(() => {
  //   axios({
  //     url: API_BASE_URL + "/cert/testList",
  //     method: "get",
  //   }).then((response) => {
  //     console.log(response.data);
  //   });
  // }, []);

  // useEffect(() => {
  //   axios({
  //     url: API_BASE_URL + "/cert/testContent",
  //     method: "get",
  //   }).then((response) => {
  //     console.log(response.data);
  //   });
  // }, []);

  return (
    <div>
      <div className={styles.certFindInfo}>
        <div className={styles.certContainer}>
          <div className={styles.certfindSearch}>
            <TextField
              id="outlined-search"
              type="search"
              InputProps={{
                startAdornment: <SearchIcon color="action" />,

                style: {
                  width: "280px",
                  borderRadius: "10px",
                  margin: "20px 10px",
                },
              }}
              sx={{
                "& .MuiOutlinedInput-root": {
                  "&.Mui-focused fieldset": {
                    borderColor: "#8cbf75",
                  },
                  "&.MuiInputBase-sizeSmall": {
                    paddingLeft: "14px",
                  },
                },
              }}
              size="small"
            ></TextField>
          </div>
          <Grid xs={6} style={{ padding: "5px 10px" }}>
            <FormControl sx={{ minWidth: 280 }} style={{ fontSize: "10px" }}>
              <InputLabel
                id="certLCat"
                style={{ fontSize: "14px" }}
                sx={{
                  "&.Mui-focused": {
                    color: "#8cbf75",
                  },
                  lineHeight: "100%",
                }}
              >
                대분류
              </InputLabel>
              <Select
                labelId="certLCat"
                id="certLCatSelect"
                value={certL}
                label="대분류"
                onChange={certLCatChange}
                name="certLCat"
                style={{
                  height: "50px",
                }}
                sx={{
                  "&.MuiOutlinedInput-root": {
                    "&.Mui-focused fieldset": {
                      borderColor: "#8cbf75",
                    },
                  },
                }}
              >
                {certLList &&
                  certLList.map((item) => (
                    <MenuItem key={item.obligfldcd} value={item.obligfldnm}>
                      {item.obligfldnm}
                    </MenuItem>
                  ))}
              </Select>
            </FormControl>
          </Grid>
          <Grid xs={6} style={{ padding: "5px 10px" }}>
            <FormControl sx={{ minWidth: 280 }}>
              <InputLabel
                id="certMCat"
                style={{ fontSize: "14px" }}
                sx={{
                  "&.Mui-focused": {
                    color: "#8cbf75",
                  },
                  lineHeight: "100%",
                }}
              >
                중분류
              </InputLabel>
              <Select
                labelId="certMCat"
                id="certMCatSelect"
                value={certM}
                label="중분류"
                onChange={certMCatChange}
                name="certMCat"
                style={{ height: "50px" }}
                sx={{
                  "&.MuiOutlinedInput-root": {
                    "&.Mui-focused fieldset": {
                      borderColor: "#8cbf75",
                    },
                  },
                }}
              >
                {certMList.map((item) => (
                  <MenuItem key={item.mdobligfldcd} value={item.mdobligfldnm}>
                    {item.mdobligfldnm}
                  </MenuItem>
                ))}
              </Select>
            </FormControl>
          </Grid>
          <div style={{ margin: "20px" }}>
            {certSList &&
              certSList.map((certS) => (
                <button
                  type="button"
                  key={certS.jmcd}
                  //onClick={() => handleClick(certS)}
                  className={styles.smallFindCert}
                >
                  {certS.jmfldnm}
                </button>
              ))}
          </div>
        </div>
        <div className={styles.certFind}>
          <div className={styles.certFindName}>관심등록</div>
          <div className={styles.certFindTitle}>
            사회조사분석사1급
            <Checkbox
              {...label}
              icon={<FavoriteBorder />}
              checkedIcon={<Favorite />}
              classes={{ root: "custom-checkbox-root" }}
              style={{ float: "right", marginTop: "-10px" }}
            />
          </div>
          <Box sx={{ width: "100%" }}>
            <Box sx={{ borderBottom: 0, borderColor: "divider" }}>
              <Tabs
                value={value}
                onChange={handleChange}
                textColor="inherit"
                TabIndicatorProps={{
                  style: { background: "rgb(140, 191, 117)" },
                }}
                aria-label="cert plan"
                variant="fullWidth"
                sx={{
                  "& button": { background: "rgba(140, 191, 117, 0.5)" },
                }}
              >
                <Tab label="시험 일정" {...a11yProps(0)} />
                <Tab label="원서접수 안내" {...a11yProps(1)} />
                <Tab label="원서접수 유의사항" {...a11yProps(2)} />
                <Tab label="기본 안내사항" {...a11yProps(3)} />
              </Tabs>
            </Box>
            <TabPanel
              value={value}
              index={0}
              style={{ background: "rgba(255, 255, 255, 0.05)" }}
            >
              <TestSchedule />
            </TabPanel>
            <TabPanel
              value={value}
              index={1}
              style={{ background: "rgba(255, 255, 255, 0.05)" }}
            >
              <ApplicationInfo />
            </TabPanel>
            <TabPanel
              value={value}
              index={2}
              style={{ background: "rgba(255, 255, 255, 0.05)" }}
            >
              <ApplicationCaution />
            </TabPanel>
            <TabPanel
              value={value}
              index={3}
              style={{ background: "rgba(255, 255, 255, 0.05)" }}
            >
              <BasicsInfo />
            </TabPanel>
          </Box>
        </div>
      </div>
    </div>
  );
};

export default CertFind;
