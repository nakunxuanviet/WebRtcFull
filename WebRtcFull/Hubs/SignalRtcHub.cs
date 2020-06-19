using Microsoft.AspNetCore.SignalR;
using System;
using System.Collections.Generic;
using System.Linq;
using System.Threading.Tasks;

namespace WebRtcFull.Hubs
{
	public class SignalRtcHub: Hub
	{
		[HubMethodName("ready")]
		public Task Ready(string user, string message)
		{
			return Clients.All.SendAsync("announce", user, message);
		}

		public Task SendMessageToUser(string connectionId, string message)
		{
			return Clients.Client(connectionId).SendAsync("ReceivedMessage", message);
		}

		public Task JoinGroup(string group)
		{
			return Groups.AddToGroupAsync(Context.ConnectionId, group);
		}

		public Task SendMessageToGroup(string group, string message)
		{
			return Clients.Group(group).SendAsync("ReceiveMessage", message);
		}

		public override async Task OnConnectedAsync()
		{
			await Clients.All.SendAsync("UserConnected", Context.ConnectionId);
			await base.OnConnectedAsync();
		}

		public override async Task OnDisconnectedAsync(Exception exception)
		{
			await Clients.All.SendAsync("UserDisconnected", Context.ConnectionId);
			await base.OnDisconnectedAsync(exception);
		}
	}
}
