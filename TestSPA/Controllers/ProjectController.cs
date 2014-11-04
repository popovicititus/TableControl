using System;
using System.Collections.Generic;
using System.Collections.ObjectModel;
using System.Data.Entity;
using System.Linq;
using System.Net;
using System.Net.Http;
using System.Web;
using System.Web.Http;
using TestSPA.Data;
using TestSPA.DataTransferObjects;
using TestSPA.Extensions;
using TestSPA.Helpers;

namespace TestSPA.Controllers
{
    public class ProjectController : ApiController
    {
        private readonly DatabaseContext dbContext  = new DatabaseContext();

        [HttpGet]
        public ProjectDto Get(int id)
        {
            return dbContext.Projects.Find(id).ConvertToDto();
        }

        [HttpGet]
        public ICollection<ProjectDto> All()
        {
            return dbContext.Projects.Take(10).AsNoTracking().AsEnumerable().Select(p => p.ConvertToDto()).ToList();
        }

        [HttpGet]
        public ProjectRowsContainer Read(int skip = 0, string order = "", int take = 10, string filter = null)
        {
            return new ProjectRowsContainer
            {
                Projects =
                    dbContext.Projects.OrderBy(p => p.Name)
                        .Skip(skip > 0 ? skip : 0)
                        .Take(take)
                        .AsNoTracking()
                        .AsEnumerable()
                        .Select(p => p.ConvertToDto())
                        .ToList(),
                Count = 1500
            };
        }

        [HttpGet]
        public ICollection<int> Selection()
        {
            return dbContext.Projects.Select(p => p.Id).ToList();
        }

        [HttpPut]
        public HttpResponseMessage Add(ProjectDto model)
        {
            dbContext.Projects.Add(model.ConvertToEntity());
            dbContext.SaveChanges();
            return new HttpResponseMessage
            {
                StatusCode = HttpStatusCode.OK
            };
        }

        [HttpDelete]
        public HttpResponseMessage Delete(ProjectIdsContainer model)
        {
            dbContext.Projects.RemoveRange( dbContext.Projects.Where(p => model.ids.Contains(p.Id)).AsEnumerable());
            dbContext.SaveChanges();
            return new HttpResponseMessage(HttpStatusCode.OK);
        }

        public HttpResponseMessage Update(Project model)
        {
            var entity = dbContext.Projects.Find(model.Id);
            entity.Name = model.Name;
            entity.Status = model.Status;
            entity.To = model.To;
            entity.Description = model.Description;
            entity.CustomerId = model.CustomerId;
            dbContext.SaveChanges();
            return new HttpResponseMessage(HttpStatusCode.OK);
        }
        
	}
}