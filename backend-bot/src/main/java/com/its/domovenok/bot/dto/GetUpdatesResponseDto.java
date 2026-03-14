package com.its.domovenok.bot.dto;

import com.fasterxml.jackson.annotation.JsonIgnoreProperties;
import java.util.ArrayList;
import java.util.List;
import lombok.AllArgsConstructor;
import lombok.Getter;
import lombok.NoArgsConstructor;
import lombok.Setter;

@Getter
@Setter
@NoArgsConstructor
@AllArgsConstructor
@JsonIgnoreProperties(ignoreUnknown = true)
public class GetUpdatesResponseDto {

    private List<UpdateDto> updates;
    private List<UpdateDto> data;
    private String marker;

    /** Список апдейтов из поля "updates" или "data". */
    public List<UpdateDto> getUpdatesList() {
        if (updates != null && !updates.isEmpty()) return updates;
        if (data != null && !data.isEmpty()) return data;
        return new ArrayList<>();
    }
}
