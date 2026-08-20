using Microsoft.EntityFrameworkCore;
using NotificationService.Dao;
using NotificationService.Dtos;
using NotificationService.Entities;

namespace NotificationService.Services;

public class NotificationService : INotificationService
{
    private readonly NotificationDbContext _dbContext;

    public NotificationService(NotificationDbContext dbContext)
    {
        _dbContext = dbContext;
    }

    public async Task<NotificationResponseDto> CreateNotificationAsync(CreateNotificationDto dto)
    {
        var notification = new Notification
        {
            UserId = dto.UserId,
            Title = dto.Title,
            Message = dto.Message,
            Type = dto.Type,
            ReferenceId = dto.ReferenceId,
            ReferenceType = dto.ReferenceType,
            IsRead = false,
            CreatedAt = DateTime.UtcNow
        };

        _dbContext.Notifications.Add(notification);
        await _dbContext.SaveChangesAsync();

        return MapToResponseDto(notification);
    }

    public async Task<List<NotificationResponseDto>> GetMyNotificationsAsync(long userId)
    {
        return await _dbContext.Notifications
            .Where(n => n.UserId == userId)
            .OrderByDescending(n => n.CreatedAt)
            .Select(n => new NotificationResponseDto
            {
                Id = n.Id,
                UserId = n.UserId,
                Title = n.Title,
                Message = n.Message,
                Type = n.Type,
                IsRead = n.IsRead,
                ReferenceId = n.ReferenceId,
                ReferenceType = n.ReferenceType,
                CreatedAt = n.CreatedAt
            })
            .ToListAsync();
    }

    public async Task<int> GetUnreadCountAsync(long userId)
    {
        return await _dbContext.Notifications
            .CountAsync(n => n.UserId == userId && !n.IsRead);
    }

    public async Task MarkAsReadAsync(long notificationId, long userId)
    {
        var notification = await _dbContext.Notifications
            .FirstOrDefaultAsync(n => n.Id == notificationId && n.UserId == userId);

        if (notification == null)
        {
            throw new Exception("Notification not found");
        }

        notification.IsRead = true;

        await _dbContext.SaveChangesAsync();
    }

    public async Task MarkAllAsReadAsync(long userId)
    {
        var unreadNotifications = await _dbContext.Notifications
            .Where(n => n.UserId == userId && !n.IsRead)
            .ToListAsync();

        foreach (var notification in unreadNotifications)
        {
            notification.IsRead = true;
        }

        await _dbContext.SaveChangesAsync();
    }

    private static NotificationResponseDto MapToResponseDto(Notification notification)
    {
        return new NotificationResponseDto
        {
            Id = notification.Id,
            UserId = notification.UserId,
            Title = notification.Title,
            Message = notification.Message,
            Type = notification.Type,
            IsRead = notification.IsRead,
            ReferenceId = notification.ReferenceId,
            ReferenceType = notification.ReferenceType,
            CreatedAt = notification.CreatedAt
        };
    }
}