package com.spring.specfarm.controller.community;

import static org.hamcrest.CoreMatchers.nullValue;

import java.io.File;
import java.io.IOException;
import java.util.HashMap;
import java.util.Iterator;
import java.util.List;
import java.util.Map;
import java.util.UUID;

import javax.servlet.http.HttpServletRequest;
import javax.servlet.http.HttpSession;

import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.data.domain.Page;
import org.springframework.data.domain.Pageable;
import org.springframework.data.domain.Sort.Direction;
import org.springframework.data.web.PageableDefault;
import org.springframework.security.core.annotation.AuthenticationPrincipal;
import org.springframework.web.bind.annotation.DeleteMapping;
import org.springframework.web.bind.annotation.GetMapping;
import org.springframework.web.bind.annotation.ModelAttribute;
import org.springframework.web.bind.annotation.PostMapping;
import org.springframework.web.bind.annotation.RequestMapping;
import org.springframework.web.bind.annotation.RequestParam;
import org.springframework.web.bind.annotation.RestController;
import org.springframework.web.multipart.MultipartFile;
import com.spring.specfarm.entity.Study;
import com.spring.specfarm.entity.StudyApply;
import com.spring.specfarm.entity.User;
import com.spring.specfarm.service.community.StudyService;

@RestController
@RequestMapping("/community/study")
public class StudyController {
	@Autowired
	StudyService studyService;

	@GetMapping("/getUser")
	public User getUser(@AuthenticationPrincipal String userId) {

		User user = studyService.getUser(userId);

		return user;

	}

	@GetMapping("")
	public Map<String, Object> getStudyList(
			@PageableDefault(page = 0, size = 8, sort = "studyIdx", direction = Direction.DESC) Pageable pageable,
			@RequestParam String searchKeyword) {
		try {
			System.out.println(searchKeyword+"    getStudyListgetStudyListgetStudyList");
			Page<Study> studyList = studyService.getStudyList(searchKeyword, pageable);
			System.out.println(studyList);
			Map<String, Object> response = new HashMap<String, Object>();
			response.put("studyList", studyList);

			return response;
			
		} catch (Exception e) {
			Map<String, Object> errorMap = new HashMap<String, Object>();
			errorMap.put("error", e.getMessage());
			return errorMap;
		}
	}

	@GetMapping("/getStudy")
	public Map<String, Object> getStudy(@RequestParam("id") int studyIdx) {
		try {

			Map<String, Object> resultMap = new HashMap<String, Object>();

			Study study = studyService.getStudy(studyIdx);

			resultMap.put("study", study);

			return resultMap;
		} catch (Exception e) {
			Map<String, Object> errorMap = new HashMap<String, Object>();
			errorMap.put("error", e.getMessage());
			return errorMap;
		}
	}

	@GetMapping("/getStudyMemberList")
	public Map<String, Object> getStudyMemberList(@RequestParam("id") int studyIdx) {
		try {
			System.out.println(studyIdx + "studyIdxstudyIdxstudyIdx");
			Map<String, Object> resultMap = new HashMap<String, Object>();

			List<StudyApply> studyMemberList = studyService.getStudyMemberList(studyIdx);

			resultMap.put("studyMemberList", studyMemberList);

			return resultMap;
		} catch (Exception e) {
			Map<String, Object> errorMap = new HashMap<String, Object>();
			errorMap.put("error", e.getMessage());
			return errorMap;
		}
	}

	@PostMapping("/register")
	public Map<String, Object> insertStudy(@ModelAttribute Study study, @AuthenticationPrincipal String userId,
			HttpSession session, @RequestParam("imgFile") MultipartFile multipartFile,
			@PageableDefault(page = 0, size = 8, sort = "studyIdx", direction = Direction.DESC) Pageable pageable)
			throws IOException {
		try {

			User user = getUser(userId);
			study.setUser(user);

			String rootPath = session.getServletContext().getRealPath("/");

			String attachPath = "../frontend/public/upload/study/";
			File directory = new File(rootPath + attachPath);
			if (directory.exists() == false) {
				// 서버 루트 경로에 upload 폴더 만들기
				directory.mkdir();
			}
			// 첨부파일이 있는 경우에만 DB에 파일이름 저장
			if (multipartFile.getOriginalFilename() != "") {

				// 고유한 파일명 생성
				// 실제 서버에 저장되는 파일명
				String uuid = UUID.randomUUID().toString();
				// 파일명에 공백이 있으면 렌더링 시 파일을 못찾아 "_"로 변환
				String rmSpaceFileName = multipartFile.getOriginalFilename().replace(" ", "_");
				study.setStudyImgName(uuid + rmSpaceFileName);

				// 파일 업로드 처리
				File file = new File(rootPath + attachPath + uuid + rmSpaceFileName);

				multipartFile.transferTo(file);
			}

			int studyIdx = studyService.insertStudy(study);

			Page<Study> studyList = studyService.getStudyList("",pageable);

			insertStudyMember(userId, studyIdx, 1);

			List<StudyApply> studyMemberList = studyService.getStudyMemberList(studyIdx);

			Map<String, Object> response = new HashMap<String, Object>();
			response.put("studyIdx", studyIdx);
			response.put("studyList", studyList);
			response.put("studyMemberList", studyMemberList);

			return response;
		} catch (Exception e) {

			Map<String, Object> errorMap = new HashMap<String, Object>();
			errorMap.put("error", e.getMessage());
			return errorMap;
		}
	}

	@PostMapping("/edit")
	public Map<String, Object> editStudy(@ModelAttribute Study study, HttpSession session,
			@RequestParam("imgFile") MultipartFile multipartFile,
			@PageableDefault(page = 0, size = 8, sort = "studyIdx", direction = Direction.DESC) Pageable pageable)
			throws IOException {
		try {
			System.out.println(study);

			String rootPath = session.getServletContext().getRealPath("/");

			String attachPath = "../frontend/public/upload/study/";
			File directory = new File(rootPath + attachPath);
			if (directory.exists() == false) {
				// 서버 루트 경로에 upload 폴더 만들기
				directory.mkdir();
			}
			// 첨부파일이 있는 경우에만 DB에 파일이름 저장
			if (multipartFile.getOriginalFilename() != "") {

				// 고유한 파일명 생성
				// 실제 서버에 저장되는 파일명
				String uuid = UUID.randomUUID().toString();
				// 파일명에 공백이 있으면 렌더링 시 파일을 못찾아 "_"로 변환
				String rmSpaceFileName = multipartFile.getOriginalFilename().replace(" ", "_");
				study.setStudyImgName(uuid + rmSpaceFileName);

				// 파일 업로드 처리
				File file = new File(rootPath + attachPath + uuid + rmSpaceFileName);

				multipartFile.transferTo(file);
			}

			int studyIdx = studyService.insertStudy(study);

			Page<Study> studyList = studyService.getStudyList("", pageable);

			Map<String, Object> response = new HashMap<String, Object>();
			response.put("studyIdx", studyIdx);
			response.put("studyList", studyList);

			return response;
		} catch (Exception e) {

			Map<String, Object> errorMap = new HashMap<String, Object>();
			errorMap.put("error", e.getMessage());
			return errorMap;
		}
	}

	@DeleteMapping("/delete")
	public Map<String, Object> deleteStudy(@RequestParam("id") int studyIdx,
			@PageableDefault(page = 0, size = 8, sort = "studyIdx", direction = Direction.DESC) Pageable pageable) {
		try {

			Map<String, Object> resultMap = new HashMap<String, Object>();

			Page<Study> studyList = studyService.deleteStudy(studyIdx, pageable);

			resultMap.put("studyList", studyList);

			return resultMap;
		} catch (Exception e) {
			Map<String, Object> errorMap = new HashMap<String, Object>();
			errorMap.put("error", e.getMessage());
			return errorMap;
		}
	}

	@GetMapping("/studyJoin")
	public Map<String, Object> insertStudyMember(@RequestParam String userId, @RequestParam int studyIdx,
			@RequestParam int acceptYn) {
		try {
			Map<String, Object> resultMap = new HashMap<String, Object>();

			User user = getUser(userId);

			StudyApply studyApply = studyService.getStudyApply(studyIdx, userId);

			if (studyApply.getStudyApplyIdx() == 0) {
				studyApply = new StudyApply();
				studyApply.setStudyApplyIdx(studyService.getStudyApplyIdx(studyIdx));
				studyApply.setUser(user);
				studyApply.setStudyIdx(studyIdx);
			}
			studyApply.setAcceptYn(acceptYn);

			Study study = studyService.getStudy(studyIdx);

			if (studyApply.getAcceptYn() == 1)
				study.setStudyMemberCnt(study.getStudyMemberCnt() + 1);

			if (study.getStudyMaxMember() == study.getStudyMemberCnt()) {
				study.setStudyYn("N");
			}

			studyService.insertStudy(study);

			study = studyService.getStudy(studyIdx);

			List<StudyApply> studyMemberList = studyService.insertStudyMember(studyApply);

			resultMap.put("studyMemberList", studyMemberList);
			resultMap.put("study", study);

			return resultMap;

		} catch (Exception e) {
			Map<String, Object> errorMap = new HashMap<String, Object>();
			errorMap.put("error", e.getMessage());
			return errorMap;
		}
	}

	@DeleteMapping("/cancelJoin")
	public Map<String, Object> cancelJoin(@RequestParam int studyIdx, @RequestParam String userId) {
		try {
			Map<String, Object> resultMap = new HashMap<String, Object>();
			List<StudyApply> studyMemberList = studyService.cancelJoin(studyIdx, userId);

			Study study = studyService.getStudy(studyIdx);

			study.setStudyMemberCnt(study.getStudyMemberCnt() - 1);

			if (study.getStudyMaxMember() > study.getStudyMemberCnt()) {
				study.setStudyYn("Y");
			}

			studyService.insertStudy(study);

			study = studyService.getStudy(studyIdx);
			studyMemberList = studyService.getStudyMemberList(studyIdx);

			resultMap.put("studyMemberList", studyMemberList);
			resultMap.put("study", study);

			return resultMap;

		} catch (Exception e) {
			Map<String, Object> errorMap = new HashMap<String, Object>();
			errorMap.put("error", e.getMessage());
			return errorMap;
		}
	}
}
