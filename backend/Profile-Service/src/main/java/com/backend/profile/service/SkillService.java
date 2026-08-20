package com.backend.profile.service;

import java.util.List;

import com.backend.profile.dtos.SkillRequestDto;
import com.backend.profile.dtos.SkillResponseDto;

public interface SkillService {

    SkillResponseDto addSkill(Long candidateProfileId, SkillRequestDto dto);

    List<SkillResponseDto> getSkills(Long candidateProfileId);

    void deleteSkill(Long candidateProfileId, Long candidateSkillId);
}
