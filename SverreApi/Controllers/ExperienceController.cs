using Microsoft.AspNetCore.Mvc;
using Microsoft.EntityFrameworkCore.Metadata.Internal;
using SverreData;
using System.Runtime.InteropServices;

public class ExperienceController : ControllerBase
{
    private static SverreDataContext context = new SverreDataContext();
    [HttpGet("GetServerLeaderboard")]
    public IEnumerable<Sverre_Table_Experience> GetServerLeaderboard(string serverID)
    {
        return context.Experience.Where(s => s.serverid == serverID).ToList();

    }
    [HttpGet("GetServerIDs")]
    public IEnumerable<String> GetAllServerIDs()
    {
     return context.Experience.Select(s => s.serverid).Distinct().ToList();
     
    }
}