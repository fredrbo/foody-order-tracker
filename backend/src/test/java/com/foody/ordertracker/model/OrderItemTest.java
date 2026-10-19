package com.foody.ordertracker.model;

import org.junit.jupiter.api.Test;

import java.math.BigDecimal;

import static org.assertj.core.api.Assertions.assertThat;

class OrderItemTest {

    @Test
    void shouldMultiplyUnitPriceByQuantity() {
        OrderItem item = new OrderItem();
        item.setQuantity(2);
        item.setUnitPrice(new BigDecimal("45.90"));

        assertThat(item.getSubtotal()).isEqualByComparingTo("91.80");
    }
}
