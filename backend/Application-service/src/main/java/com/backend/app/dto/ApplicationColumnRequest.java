package com.backend.app.dto;

import jakarta.validation.constraints.NotBlank;
import lombok.Getter;
import lombok.Setter;

@Getter
@Setter
public class ApplicationColumnRequest {

    @NotBlank(message = "Column name is required")
    private String columnName;

    private Integer displayOrder;

}
