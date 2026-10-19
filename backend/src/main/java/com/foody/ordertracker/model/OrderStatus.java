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

    public OrderStatus next() {
        return switch (this) {
            case RECEBIDO -> EM_PREPARO;
            case EM_PREPARO -> SAIU_PARA_ENTREGA;
            case SAIU_PARA_ENTREGA -> ENTREGUE;
            case ENTREGUE, CANCELADO -> null;
        };
    }

    public boolean canTransitionTo(OrderStatus target) {
        if (target == CANCELADO) {
            return this == RECEBIDO || this == EM_PREPARO;
        }
        return target == next();
    }
}
