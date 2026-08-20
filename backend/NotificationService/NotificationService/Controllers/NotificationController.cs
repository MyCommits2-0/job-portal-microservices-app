using Microsoft.AspNetCore.Mvc;
using NotificationService.Dtos;
using NotificationService.Services;

namespace NotificationService.Controllers;

[ApiController]
[Route("api/notifications")]
public class NotificationsController : ControllerBase
{
    private readonly INotificationService _notificationService;

    public NotificationsController(INotificationService notificationService)
    {
        _notificationService = notificationService;
    }

    [HttpPost]
    public async Task<IActionResult> CreateNotification(CreateNotificationDto dto)
    {
        var notification = await _notificationService.CreateNotificationAsync(dto);

        return Ok(notification);
    }

    [HttpGet("me")]
    public async Task<IActionResult> GetMyNotifications(
        [FromHeader(Name = "X-User-Id")] long userId)
    {
        var notifications = await _notificationService.GetMyNotificationsAsync(userId);

        return Ok(notifications);
    }

    [HttpGet("unread-count")]
    public async Task<IActionResult> GetUnreadCount(
        [FromHeader(Name = "X-User-Id")] long userId)
    {
        var count = await _notificationService.GetUnreadCountAsync(userId);

        return Ok(new
        {
            count = count
        });
    }

    [HttpPatch("{id:long}/read")]
    public async Task<IActionResult> MarkAsRead(
        long id,
        [FromHeader(Name = "X-User-Id")] long userId)
    {
        await _notificationService.MarkAsReadAsync(id, userId);

        return Ok(new
        {
            message = "Notification marked as read"
        });
    }

    [HttpPatch("mark-all-read")]
    public async Task<IActionResult> MarkAllAsRead(
        [FromHeader(Name = "X-User-Id")] long userId)
    {
        await _notificationService.MarkAllAsReadAsync(userId);

        return Ok(new
        {
            message = "All notifications marked as read"
        });
    }
}