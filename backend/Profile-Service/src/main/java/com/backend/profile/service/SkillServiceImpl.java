package com.backend.profile.service;

import java.util.List;

import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;

import com.backend.daos.CandidateProfileRepository;
import com.backend.daos.CandidateSkillRepository;
import com.backend.daos.SkillRepository;
import com.backend.profile.dtos.SkillRequestDto;
import com.backend.profile.dtos.SkillResponseDto;
import com.backend.profile.entities.CandidateProfile;
import com.backend.profile.entities.CandidateSkill;
import com.backend.profile.entities.Skill;
import com.backend.profile.exceptions.ResourceNotFoundException;

import lombok.RequiredArgsConstructor;

@Service
@RequiredArgsConstructor
@Transactional
public class SkillServiceImpl implements SkillService {

    private final CandidateProfileRepository candidateProfileRepository;

    private final CandidateSkillRepository candidateSkillRepository;

    private final SkillRepository skillRepository;

    @Override
    public SkillResponseDto addSkill(Long candidateProfileId, SkillRequestDto dto) {

        CandidateProfile candidate = candidateProfileRepository.findById(candidateProfileId)
                .orElseThrow(() -> new ResourceNotFoundException("Candidate profile not found"));

        String skillName = dto.getName().trim();

        Skill skill = skillRepository.findByName(skillName)
                .orElseGet(() -> {
                    Skill newSkill = new Skill();
                    newSkill.setName(skillName);
                    return skillRepository.save(newSkill);
                });

        if (candidateSkillRepository.existsByCandidateIdAndSkillId(candidateProfileId, skill.getId())) {
            throw new RuntimeException("Skill already added to this candidate");
        }

        CandidateSkill candidateSkill = new CandidateSkill();
        candidateSkill.setCandidate(candidate);
        candidateSkill.setSkill(skill);

        CandidateSkill saved = candidateSkillRepository.save(candidateSkill);

        return new SkillResponseDto(saved.getId(), skill.getName());
    }

    @Override
    @Transactional(readOnly = true)
    public List<SkillResponseDto> getSkills(Long candidateProfileId) {

        return candidateSkillRepository.findByCandidateId(candidateProfileId)
                .stream()
                .map(cs -> new SkillResponseDto(cs.getId(), cs.getSkill().getName()))
                .toList();
    }

    @Override
    public void deleteSkill(Long candidateProfileId, Long candidateSkillId) {

        CandidateSkill candidateSkill = candidateSkillRepository
                .findByIdAndCandidateId(candidateSkillId, candidateProfileId)
                .orElseThrow(() -> new ResourceNotFoundException("Skill not found for candidate"));

        candidateSkillRepository.delete(candidateSkill);
    }
}
