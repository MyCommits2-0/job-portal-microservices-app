import { useState } from "react";
import { FiPlus, FiTrash2, FiBookOpen, FiBriefcase, FiAward, FiArrowRight } from "react-icons/fi";

import EducationModal from "./EducationModal";
import ExperienceModal from "./ExperienceModal";
import SkillModal from "./SkillModal";

import {
  addEducation,
  deleteEducation,
  addExperience,
  deleteExperience,
  addSkill,
  deleteSkill,
} from "../../../services/candidateSettingsService";

export default function ProfileSettings({
  candidateProfileId,
  educationList = [],
  setEducationList,
  experienceList = [],
  setExperienceList,
  skills = [],
  setSkills,
  onNext,
}) {
  const [isEducationModalOpen, setIsEducationModalOpen] = useState(false);
  const [isExperienceModalOpen, setIsExperienceModalOpen] = useState(false);
  const [isSkillModalOpen, setIsSkillModalOpen] = useState(false);

  const [deletingEducationId, setDeletingEducationId] = useState(null);
  const [deletingExperienceId, setDeletingExperienceId] = useState(null);
  const [deletingSkillId, setDeletingSkillId] = useState(null);

  const [sectionError, setSectionError] = useState("");

  const handleAddEducation = async (form) => {
    const created = await addEducation(candidateProfileId, form);
    setEducationList?.([...educationList, created]);
    setSectionError("");
  };

  const handleDeleteEducation = async (education) => {
    if (!window.confirm("Are you sure you want to delete this education entry?")) return;

    try {
      setDeletingEducationId(education.id);
      await deleteEducation(candidateProfileId, education.id);
      setEducationList?.(educationList.filter((item) => item.id !== education.id));
    } catch (error) {
      console.error(error);
      setSectionError("Failed to delete education entry");
    } finally {
      setDeletingEducationId(null);
    }
  };

  const handleAddExperience = async (form) => {
    const created = await addExperience(candidateProfileId, form);
    setExperienceList?.([...experienceList, created]);
    setSectionError("");
  };

  const handleDeleteExperience = async (experience) => {
    if (!window.confirm("Are you sure you want to delete this experience entry?")) return;

    try {
      setDeletingExperienceId(experience.id);
      await deleteExperience(candidateProfileId, experience.id);
      setExperienceList?.(experienceList.filter((item) => item.id !== experience.id));
    } catch (error) {
      console.error(error);
      setSectionError("Failed to delete experience entry");
    } finally {
      setDeletingExperienceId(null);
    }
  };

  const handleAddSkill = async (form) => {
    const exists = skills.some((skill) => getSkillName(skill).toLowerCase() === form.name.toLowerCase());
    if (exists) return;

    const created = await addSkill(candidateProfileId, form);
    setSkills?.([...skills, created]);
    setSectionError("");
  };

  const handleDeleteSkill = async (skill) => {
    const skillId = skill.id;

    try {
      setDeletingSkillId(skillId);
      await deleteSkill(candidateProfileId, skillId);
      setSkills?.(skills.filter((item) => item.id !== skillId));
    } catch (error) {
      console.error(error);
      setSectionError("Failed to delete skill");
    } finally {
      setDeletingSkillId(null);
    }
  };

  return (
    <div className="space-y-8">
      {sectionError && (
        <p className="rounded-md bg-red-50 px-4 py-3 text-sm text-red-600">{sectionError}</p>
      )}

      <section className="rounded-xl border border-gray-200 bg-white p-4 sm:p-6">
        <div className="flex flex-col gap-3 sm:flex-row sm:items-center sm:justify-between">
          <div className="flex items-center gap-3">
            <div className="rounded-md bg-blue-100 p-2 text-blue-600">
              <FiBookOpen className="text-xl" />
            </div>
            <h2 className="text-lg font-semibold text-gray-900">Education</h2>
          </div>
          <button
            type="button"
            onClick={() => setIsEducationModalOpen(true)}
            className="inline-flex items-center justify-center gap-2 rounded-md bg-blue-50 px-4 py-2 text-sm font-medium text-blue-600 hover:bg-blue-100"
          >
            <FiPlus /> Add Education
          </button>
        </div>

        <ListPreview
          items={educationList}
          getTitle={(item) => item.degree}
          getSubtitle={(item) => `${item.institute} • ${item.passingYear}${item.grade ? ` • ${item.grade}` : ""}`}
          onDelete={handleDeleteEducation}
          deletingId={deletingEducationId}
          emptyLabel="No education added yet."
        />
      </section>

      <section className="rounded-xl border border-gray-200 bg-white p-4 sm:p-6">
        <div className="flex flex-col gap-3 sm:flex-row sm:items-center sm:justify-between">
          <div className="flex items-center gap-3">
            <div className="rounded-md bg-blue-100 p-2 text-blue-600">
              <FiBriefcase className="text-xl" />
            </div>
            <h2 className="text-lg font-semibold text-gray-900">Experience</h2>
          </div>
          <button
            type="button"
            onClick={() => setIsExperienceModalOpen(true)}
            className="inline-flex items-center justify-center gap-2 rounded-md bg-blue-50 px-4 py-2 text-sm font-medium text-blue-600 hover:bg-blue-100"
          >
            <FiPlus /> Add Experience
          </button>
        </div>

        <ListPreview
          items={experienceList}
          getTitle={(item) => item.jobTitle}
          getSubtitle={(item) => `${item.companyName} • ${item.startDate}${item.endDate ? ` to ${item.endDate}` : " to Present"}`}
          onDelete={handleDeleteExperience}
          deletingId={deletingExperienceId}
          emptyLabel="No experience added yet."
        />
      </section>

      <section className="rounded-xl border border-gray-200 bg-white p-4 sm:p-6">
        <div className="flex flex-col gap-3 sm:flex-row sm:items-center sm:justify-between">
          <div className="flex items-center gap-3">
            <div className="rounded-md bg-blue-100 p-2 text-blue-600">
              <FiAward className="text-xl" />
            </div>
            <h2 className="text-lg font-semibold text-gray-900">Skills</h2>
          </div>
          <button
            type="button"
            onClick={() => setIsSkillModalOpen(true)}
            className="inline-flex items-center justify-center gap-2 rounded-md bg-blue-50 px-4 py-2 text-sm font-medium text-blue-600 hover:bg-blue-100"
          >
            <FiPlus /> Add Skill
          </button>
        </div>

        {skills.length > 0 ? (
          <div className="mt-4 flex flex-wrap gap-2">
            {skills.map((skill, index) => (
              <span key={skill.id || getSkillName(skill) || index} className="inline-flex items-center gap-2 rounded-full bg-blue-50 px-3 py-1 text-sm text-blue-700">
                {getSkillName(skill)}
                <button
                  type="button"
                  onClick={() => handleDeleteSkill(skill)}
                  disabled={deletingSkillId === skill.id}
                  className="text-blue-500 hover:text-red-500 disabled:opacity-50"
                >
                  ×
                </button>
              </span>
            ))}
          </div>
        ) : (
          <p className="mt-4 text-sm text-gray-500">No skills added yet.</p>
        )}
      </section>

      <div className="flex justify-end">
        <button
          type="button"
          onClick={() => onNext?.("social")}
          className="inline-flex items-center gap-2 rounded-md bg-blue-600 px-8 py-3 font-semibold text-white hover:bg-blue-700"
        >
          Next <FiArrowRight />
        </button>
      </div>

      <EducationModal
        isOpen={isEducationModalOpen}
        onClose={() => setIsEducationModalOpen(false)}
        onSave={handleAddEducation}
      />

      <ExperienceModal
        isOpen={isExperienceModalOpen}
        onClose={() => setIsExperienceModalOpen(false)}
        onSave={handleAddExperience}
      />

      <SkillModal
        isOpen={isSkillModalOpen}
        onClose={() => setIsSkillModalOpen(false)}
        onSave={handleAddSkill}
      />
    </div>
  );
}

function getSkillName(skill) {
  return typeof skill === "string" ? skill : skill.name || skill.skillName || "";
}

function ListPreview({ items, getTitle, getSubtitle, onDelete, deletingId, emptyLabel }) {
  if (!items.length) {
    return <p className="mt-4 text-sm text-gray-500">{emptyLabel}</p>;
  }

  return (
    <div className="mt-4 grid grid-cols-1 gap-3 md:grid-cols-2">
      {items.map((item, index) => (
        <div key={item.id || item.clientId || index} className="flex items-start justify-between gap-3 rounded-md border border-gray-200 bg-gray-50 p-3">
          <div className="min-w-0">
            <h4 className="truncate text-sm font-semibold text-gray-900">{getTitle(item)}</h4>
            <p className="truncate text-xs text-gray-500">{getSubtitle(item)}</p>
          </div>
          <button
            type="button"
            onClick={() => onDelete(item)}
            disabled={deletingId === item.id}
            className="rounded p-1 text-red-500 hover:bg-red-50 disabled:opacity-50"
          >
            <FiTrash2 />
          </button>
        </div>
      ))}
    </div>
  );
}
