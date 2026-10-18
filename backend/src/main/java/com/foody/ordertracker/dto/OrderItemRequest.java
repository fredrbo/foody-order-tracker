package com.foody.ordertracker.dto;

import jakarta.validation.constraints.Digits;
import jakarta.validation.constraints.NotBlank;
import jakarta.validation.constraints.NotNull;
import jakarta.validation.constraints.Positive;
import jakarta.validation.constraints.PositiveOrZero;

import java.math.BigDecimal;

public record OrderItemRequest(
        @NotBlank
        String productName,

        @NotNull @Positive
        Integer quantity,

        @NotNull @PositiveOrZero @Digits(integer = 8, fraction = 2)
        BigDecimal unitPrice
) {
}
