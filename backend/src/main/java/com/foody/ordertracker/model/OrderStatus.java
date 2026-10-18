package com.foody.ordertracker.model;

import jakarta.persistence.EnumeratedValue;
import lombok.Getter;

@Getter
public enum OrderStatus {
    RECEBIDO(1),
    EM_PREPARO(2),
    SAIU_PARA_ENTREGA(3),
    ENTREGUE(4),
    CANCELADO(5);

    @EnumeratedValue
    private final int code;

    OrderStatus(int code) {
        this.code = code;
    }
}
