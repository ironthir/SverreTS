using Microsoft.EntityFrameworkCore;

namespace SverreDB
{
    public class SverreDBContext : DbContext
    {
        public SverreDBContext (DbContextOptions<SverreDBContext> options) : base (options)
        {

        }
    }
}