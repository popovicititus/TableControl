using System;
using System.Collections.Generic;
using System.Linq;
using System.Web;
using TestSPA.Data;
using TestSPA.DataTransferObjects;

namespace TestSPA.Extensions
{
    public static class ProjectExtensions
    {
        public static ProjectDto ConvertToDto(this Project entity)
        {
            return new ProjectDto
            {
                Id = entity.Id,
                Customer = entity.Customer.ConvertToDto(),
                CustomerId = entity.CustomerId,
                Description = entity.Description,
                From = entity.From,
                Name = entity.Name,
                Status = entity.Status,
                Tasks = entity.Tasks.Select(t => t.ConvertToDto()).ToList(),
                To = entity.To
            };
        }

        public static Project ConvertToEntity(this ProjectDto dto)
        {
            return new Project
            {
                Id = dto.Id,
                CustomerId = dto.CustomerId,
                Description = dto.Description,
                From = dto.From,
                Name = dto.Name,
                Status = dto.Status,
                To = dto.To
            };
        }

        public static CustomerDto ConvertToDto(this Customer entity)
        {
            return new CustomerDto
            {
                Id = entity.Id,
                Description = entity.Description,
                Name = entity.Name,
                Projects = new List<ProjectDto>()
            };
        }

        public static TaskDto ConvertToDto(this Task entity)
        {
            return new TaskDto
            {
                Name = entity.Name,
                Project = new ProjectDto(),
                ProjectId = entity.ProjectId
            };
        }
    }
}