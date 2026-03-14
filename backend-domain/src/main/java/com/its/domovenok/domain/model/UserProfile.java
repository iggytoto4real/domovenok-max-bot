package com.its.domovenok.domain.model;

import lombok.AllArgsConstructor;
import lombok.Data;
import lombok.NoArgsConstructor;

@Data
@NoArgsConstructor
@AllArgsConstructor
public class UserProfile {

    private Long id;
    private String firstName;
    private String lastName;
    private String username;
    private String languageCode;
    private String photoUrl;
}
