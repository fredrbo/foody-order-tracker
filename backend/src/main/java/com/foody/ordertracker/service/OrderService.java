package com.foody.ordertracker.service;

import com.foody.ordertracker.dto.OrderItemRequest;
import com.foody.ordertracker.dto.OrderRequest;
import com.foody.ordertracker.dto.OrderResponse;
import com.foody.ordertracker.dto.OrderStatusRequest;
import com.foody.ordertracker.exception.InvalidStatusTransitionException;
import com.foody.ordertracker.exception.ResourceNotFoundException;
import com.foody.ordertracker.model.Order;
import com.foody.ordertracker.model.OrderItem;
import com.foody.ordertracker.model.OrderStatus;
import com.foody.ordertracker.repository.OrderRepository;
import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;

import java.util.List;

@Service
public class OrderService {

    private final OrderRepository orderRepository;

    public OrderService(OrderRepository orderRepository) {
        this.orderRepository = orderRepository;
    }

    @Transactional
    public OrderResponse create(OrderRequest request) {
        Order order = new Order();
        order.setCustomerName(request.customerName().trim());
        order.setDeliveryAddress(request.deliveryAddress().trim());
        order.setStatus(OrderStatus.RECEBIDO);

        for (OrderItemRequest itemRequest : request.items()) {
            OrderItem item = new OrderItem();
            item.setProductName(itemRequest.productName().trim());
            item.setQuantity(itemRequest.quantity());
            item.setUnitPrice(itemRequest.unitPrice());
            order.addItem(item);
        }

        return OrderResponse.from(orderRepository.save(order));
    }

    @Transactional(readOnly = true)
    public List<OrderResponse> findAll() {
        return orderRepository.findAllByOrderByCreatedAtDesc().stream()
                .map(OrderResponse::from)
                .toList();
    }

    @Transactional(readOnly = true)
    public OrderResponse findById(Long id) {
        return orderRepository.findWithItemsById(id)
                .map(OrderResponse::from)
                .orElseThrow(() -> new ResourceNotFoundException("Pedido", id));
    }

    @Transactional
    public OrderResponse updateStatus(Long id, OrderStatusRequest request) {
        Order order = orderRepository.findWithItemsById(id)
                .orElseThrow(() -> new ResourceNotFoundException("Pedido", id));

        if (request.status() != order.getStatus().next()) {
            throw new InvalidStatusTransitionException(order.getStatus(), request.status());
        }

        order.setStatus(request.status());
        return OrderResponse.from(orderRepository.saveAndFlush(order));
    }
}
