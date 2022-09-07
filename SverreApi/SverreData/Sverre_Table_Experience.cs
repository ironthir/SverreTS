using Microsoft.EntityFrameworkCore;
using System.ComponentModel.DataAnnotations.Schema;

namespace SverreData
{
    [Table("experiences")]
    public class Sverre_Table_Experience
    {
        public int id { get; set; }
        public string serverid { get; set; }
        public string userid { get; set; }
        public int points { get; set; }
        public int level { get; set; }
        public DateTime createdAt { get; set; } 
        public DateTime updatedAt { get; set; }
}
}
