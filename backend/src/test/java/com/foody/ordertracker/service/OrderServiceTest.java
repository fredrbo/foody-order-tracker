package com.foody.ordertracker.service;

import com.foody.ordertracker.dto.OrderItemRequest;
import com.foody.ordertracker.dto.OrderRequest;
import com.foody.ordertracker.dto.OrderResponse;
import com.foody.ordertracker.dto.OrderStatusRequest;
import com.foody.ordertracker.exception.InvalidStatusTransitionException;
import com.foody.ordertracker.exception.ResourceNotFoundException;
import com.foody.ordertracker.model.Order;
import com.foody.ordertracker.model.OrderStatus;
import com.foody.ordertracker.repository.OrderRepository;
import org.junit.jupiter.api.Test;
import org.junit.jupiter.api.extension.ExtendWith;
import org.mockito.InjectMocks;
import org.mockito.Mock;
import org.mockito.junit.jupiter.MockitoExtension;

import java.math.BigDecimal;
import java.util.List;
import java.util.Optional;

import static org.assertj.core.api.Assertions.assertThat;
import static org.assertj.core.api.Assertions.assertThatThrownBy;
import static org.mockito.ArgumentMatchers.any;
import static org.mockito.Mockito.never;
import static org.mockito.Mockito.verify;
import static org.mockito.Mockito.when;

@ExtendWith(MockitoExtension.class)
class OrderServiceTest {

    @Mock
    private OrderRepository orderRepository;

    @InjectMocks
    private OrderService orderService;

    @Test
    void shouldCreateOrderWithStatusRecebido() {
        OrderRequest request = new OrderRequest("Ana Silva", " Rua das Flores, 123 ",
                List.of(new OrderItemRequest(" Pizza ", 2, new BigDecimal("45.90"))));
        when(orderRepository.save(any(Order.class))).thenAnswer(invocation -> invocation.getArgument(0));

        OrderResponse response = orderService.create(request);

        assertThat(response.status()).isEqualTo(OrderStatus.RECEBIDO);
        assertThat(response.customerName()).isEqualTo("Ana Silva");
        assertThat(response.deliveryAddress()).isEqualTo("Rua das Flores, 123");
        assertThat(response.items()).hasSize(1);
        assertThat(response.items().getFirst().productName()).isEqualTo("Pizza");
        assertThat(response.items().getFirst().quantity()).isEqualTo(2);
    }

    @Test
    void shouldFindOrderById() {
        when(orderRepository.findWithItemsById(1L)).thenReturn(Optional.of(order(1L, OrderStatus.RECEBIDO)));

        OrderResponse response = orderService.findById(1L);

        assertThat(response.id()).isEqualTo(1L);
    }

    @Test
    void shouldThrowNotFoundWhenOrderDoesNotExist() {
        when(orderRepository.findWithItemsById(99L)).thenReturn(Optional.empty());

        assertThatThrownBy(() -> orderService.findById(99L))
                .isInstanceOf(ResourceNotFoundException.class)
                .hasMessage("Pedido 99 não encontrado.");
    }

    @Test
    void shouldListAllOrders() {
        when(orderRepository.findAllByOrderByCreatedAtDesc())
                .thenReturn(List.of(order(2L, OrderStatus.EM_PREPARO), order(1L, OrderStatus.RECEBIDO)));

        List<OrderResponse> response = orderService.findAll();

        assertThat(response).extracting(OrderResponse::id).containsExactly(2L, 1L);
    }

    @Test
    void shouldAdvanceStatusToNextStep() {
        when(orderRepository.findWithItemsById(1L)).thenReturn(Optional.of(order(1L, OrderStatus.RECEBIDO)));
        when(orderRepository.saveAndFlush(any(Order.class))).thenAnswer(invocation -> invocation.getArgument(0));

        OrderResponse response = orderService.updateStatus(1L, new OrderStatusRequest(OrderStatus.EM_PREPARO));

        assertThat(response.status()).isEqualTo(OrderStatus.EM_PREPARO);
    }

    @Test
    void shouldRejectStatusThatSkipsSteps() {
        when(orderRepository.findWithItemsById(1L)).thenReturn(Optional.of(order(1L, OrderStatus.RECEBIDO)));

        assertThatThrownBy(() -> orderService.updateStatus(1L, new OrderStatusRequest(OrderStatus.ENTREGUE)))
                .isInstanceOf(InvalidStatusTransitionException.class)
                .hasMessage("Não é possível alterar o status de RECEBIDO para ENTREGUE.");
        verify(orderRepository, never()).saveAndFlush(any());
    }


    @Test
    void shouldRejectCancelWhenOrderIsOutForDelivery() {
        when(orderRepository.findWithItemsById(1L)).thenReturn(Optional.of(order(1L, OrderStatus.SAIU_PARA_ENTREGA)));

        assertThatThrownBy(() -> orderService.updateStatus(1L, new OrderStatusRequest(OrderStatus.CANCELADO)))
                .isInstanceOf(InvalidStatusTransitionException.class)
                .hasMessage("Não é possível alterar o status de SAIU_PARA_ENTREGA para CANCELADO.");
        verify(orderRepository, never()).saveAndFlush(any());
    }

    @Test
    void shouldThrowNotFoundWhenUpdatingMissingOrder() {
        when(orderRepository.findWithItemsById(99L)).thenReturn(Optional.empty());

        assertThatThrownBy(() -> orderService.updateStatus(99L, new OrderStatusRequest(OrderStatus.EM_PREPARO)))
                .isInstanceOf(ResourceNotFoundException.class);
    }

    private Order order(Long id, OrderStatus status) {
        Order order = new Order();
        order.setId(id);
        order.setCustomerName("Cliente");
        order.setDeliveryAddress("Endereço");
        order.setStatus(status);
        return order;
    }
}
