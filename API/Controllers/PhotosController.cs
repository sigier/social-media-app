using System.Threading.Tasks;
using Application.Photos;
using Microsoft.AspNetCore.Mvc;

namespace API.Controllers
{
    public class PhotosController : BaseApiController
    {
        [HttpPost]
        public async Task<IActionResult> Add([FromForm] Adding.Command command)
        {
            return HandleResult(await Mediator.Send(command));
        } 


        [HttpDelete("{id}")]
        public async Task<IActionResult> Delete(string id)
        {
            return HandleResult(await Mediator.Send(new Deleting.Command{Id = id}));
        }

        [HttpPost("{id}/setmain")]
        public async Task<IActionResult> SetMainPhoto(string id)
        {
            return HandleResult(await Mediator.Send(new SetMainPhoto.Command {Id = id}));
        }  


    }
}