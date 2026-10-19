package com.foody.ordertracker.model;

import org.junit.jupiter.api.Test;

import static org.assertj.core.api.Assertions.assertThat;

class OrderStatusTest {

    @Test
    void shouldAdvanceFromRecebidoToEmPreparo() {
        OrderStatus status = OrderStatus.RECEBIDO;

        OrderStatus next = status.next();

        assertThat(next).isEqualTo(OrderStatus.EM_PREPARO);
    }

    @Test
    void shouldAdvanceFromEmPreparoToSaiuParaEntrega() {
        assertThat(OrderStatus.EM_PREPARO.next()).isEqualTo(OrderStatus.SAIU_PARA_ENTREGA);
    }

    @Test
    void shouldAdvanceFromSaiuParaEntregaToEntregue() {
        assertThat(OrderStatus.SAIU_PARA_ENTREGA.next()).isEqualTo(OrderStatus.ENTREGUE);
    }

    @Test
    void shouldNotAdvanceFromEntregue() {
        assertThat(OrderStatus.ENTREGUE.next()).isNull();
    }

    @Test
    void shouldNotAdvanceFromCancelado() {
        assertThat(OrderStatus.CANCELADO.next()).isNull();
    }
}
