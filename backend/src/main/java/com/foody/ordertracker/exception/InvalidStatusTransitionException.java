package com.foody.ordertracker.exception;

import com.foody.ordertracker.model.OrderStatus;

public class InvalidStatusTransitionException extends RuntimeException {

    public InvalidStatusTransitionException(OrderStatus current, OrderStatus target) {
        super("Não é possível alterar o status de " + current + " para " + target + ".");
    }
}
