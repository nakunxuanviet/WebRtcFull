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
	}
}
