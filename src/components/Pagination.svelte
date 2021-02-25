<style>
  [aria-current] {
    background-color:rgb(255, 62, 0);
    color: white;
  }
</style>

<div class="flex flex-col items-center my-12">
  <div class="flex">
      <div class="h-12 w-12 mr-1 flex justify-center items-center rounded-full cursor-pointer bg-white dark:bg-gray-700">
          <svg xmlns="http://www.w3.org/2000/svg" width="100%" height="100%" fill="none" viewBox="0 0 24 24" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round" class="feather feather-chevron-left w-6 h-6">
              <polyline points="15 18 9 12 15 6"></polyline>
          </svg>
      </div>
        <div class="flex h-12 font-medium rounded-full bg-white dark:bg-gray-700">
          <div class="w-12 md:flex justify-center items-center hidden cursor-pointer leading-5 transition duration-150 ease-in  rounded-full  ">1</div>
          <div class="w-12 md:flex justify-center items-center hidden cursor-pointer leading-5 transition duration-150 ease-in  rounded-full" aria-current="page">2</div>
          <div class="w-12 md:flex justify-center items-center hidden cursor-pointer leading-5 transition duration-150 ease-in  rounded-full  ">3</div>
          <div class="w-12 md:flex justify-center items-center hidden cursor-pointer leading-5 transition duration-150 ease-in  rounded-full  ">...</div>
          <div class="w-12 md:flex justify-center items-center hidden cursor-pointer leading-5 transition duration-150 ease-in  rounded-full  ">13</div>
          <div class="w-12 md:flex justify-center items-center hidden cursor-pointer leading-5 transition duration-150 ease-in  rounded-full  ">14</div>
          <div class="w-12 md:flex justify-center items-center hidden cursor-pointer leading-5 transition duration-150 ease-in  rounded-full  ">15</div>
          <div class="w-12 h-12 md:hidden flex justify-center items-center cursor-pointer leading-5 transition duration-150 ease-in rounded-full" aria-current="page">2</div>
      </div>
      <div class="h-12 w-12 ml-1 flex justify-center items-center rounded-full cursor-pointer bg-white dark:bg-gray-700">
          <svg xmlns="http://www.w3.org/2000/svg" width="100%" height="100%" fill="none" viewBox="0 0 24 24" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round" class="feather feather-chevron-right w-6 h-6">
              <polyline points="9 18 15 12 9 6"></polyline>
          </svg>
      </div>
  </div>
</div>