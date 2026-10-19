package com.foody.ordertracker.model;

import org.junit.jupiter.api.Test;

import java.math.BigDecimal;

import static org.assertj.core.api.Assertions.assertThat;

class OrderTest {

    @Test
    void shouldLinkItemToOrderWhenAdded() {
        Order order = new Order();
        OrderItem item = new OrderItem();

        order.addItem(item);

        assertThat(order.getItems()).containsExactly(item);
        assertThat(item.getOrder()).isSameAs(order);
    }

    @Test
    void shouldReturnZeroTotalWhenOrderHasNoItems() {
        Order order = new Order();

        assertThat(order.getTotal()).isEqualByComparingTo(BigDecimal.ZERO);
    }
}
