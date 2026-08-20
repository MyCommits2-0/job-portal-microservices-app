using NotificationService.Dtos;
using NotificationService.Entities;

namespace NotificationService.Services;

public interface INotificationService
{
    Task<NotificationResponseDto> CreateNotificationAsync(CreateNotificationDto dto);

    Task<List<NotificationResponseDto>> GetMyNotificationsAsync(long userId);

    Task<int> GetUnreadCountAsync(long userId);

    Task MarkAsReadAsync(long notificationId, long userId);

    Task MarkAllAsReadAsync(long userId);
}