package com.lumadesk.user_service.dto;

import lombok.Data;

@Data
public class UpdateAddressRequest {
    private Long userId;
    private String address;
    private String area;
    private String pinCode;
}
