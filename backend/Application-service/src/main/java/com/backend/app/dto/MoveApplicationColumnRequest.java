package com.backend.app.dto;

import jakarta.validation.constraints.NotNull;
import lombok.Getter;
import lombok.Setter;

@Getter
@Setter
public class MoveApplicationColumnRequest {

    @NotNull(message = "Column id is required")
    private Long columnId;

}
