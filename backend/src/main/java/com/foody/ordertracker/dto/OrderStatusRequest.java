package com.foody.ordertracker.dto;

import com.foody.ordertracker.model.OrderStatus;
import jakarta.validation.constraints.NotNull;

public record OrderStatusRequest(
        @NotNull
        OrderStatus status
) {
}
