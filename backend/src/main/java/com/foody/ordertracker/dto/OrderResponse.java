package com.foody.ordertracker.dto;

import com.foody.ordertracker.model.Order;
import com.foody.ordertracker.model.OrderStatus;

import java.math.BigDecimal;
import java.time.Instant;
import java.util.List;

public record OrderResponse(
        Long id,
        String customerName,
        String deliveryAddress,
        OrderStatus status,
        List<OrderItemResponse> items,
        BigDecimal total,
        Instant createdAt,
        Instant updatedAt
) {

    public static OrderResponse from(Order order) {
        List<OrderItemResponse> items = order.getItems().stream()
                .map(OrderItemResponse::from)
                .toList();
        return new OrderResponse(order.getId(), order.getCustomerName(), order.getDeliveryAddress(),
                order.getStatus(), items, order.getTotal(), order.getCreatedAt(), order.getUpdatedAt());
    }
}
