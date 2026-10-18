package com.foody.ordertracker.dto;

import com.foody.ordertracker.model.OrderItem;

import java.math.BigDecimal;

public record OrderItemResponse(Long id, String productName, Integer quantity, BigDecimal unitPrice, BigDecimal subtotal) {

    public static OrderItemResponse from(OrderItem item) {
        return new OrderItemResponse(item.getId(), item.getProductName(), item.getQuantity(),
                item.getUnitPrice(), item.getSubtotal());
    }
}
