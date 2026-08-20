package com.backend.jobs.dtos;

import java.util.List;

import lombok.AllArgsConstructor;
import lombok.Getter;
import lombok.Setter;

@Getter
@Setter
@AllArgsConstructor
public class JobIdsRequest {
	 private List<Long> jobIds;
}
