## Welcome to our findit project 👋

### 2 small disclaimers: 
1) this text (and also the code) is 100% chat GPT free and comes 100% from a human 🧠 (not
even co-pilot complete)
2) the code is pretty old and web technology was different back then, keep that in mind 😉

We created this software during our master studies at the University of Applied Sciences
in Hagenberg. The master's programme was very nice for us because we could try out
anything as long at it was technical. We opted to try out something crazy, went a little
bit over the top and decided to create our own little microservice software platform, so
we could claim we had implemented a microservice application architecture ourselves. Never
having programmed anything like this it was a challenge to say the least. We really
enjoyed trying out new technology though and also grew a lot while implementing this
project. Developing a full microservice application platform can be quite challenging, but
we eventually managed to overcome all hurdles and create something actually really cool
which was super rewarding.

If you want to read our full paper about this project you can find it
[here](docs/findit-microservices-plattform.pdf). If you prefer reading an overview you can
keep on reading this readme file.

## Motivation 🏃

For our semester project we decided to build software that help us and other users to
easily organize their documents. As we both already have several years of experience with
web technologies we decided to use technologies and patterns that are new to us or that we
haven’t used before. Our intention was to further improve our skills and to get in touch
with new technologies while actively using them.

Furthermore, we recently noticed that numerous web-service providing companies were having
severe scaling problems. Some companies took no immediate action at all which resulted in
temporarily unstable and unreachable services while other companies tried to limit
incoming requests by blocking new user registrations. Either way companies were loosing a
lot of money by not being able to correctly

## Architecture 🏛️

When creating the architecture we wanted to adhere to the event sourcing paradigm and also
try out how microservices behave when you actually use different technologies to implement
the microservices. Connecting the services via event sourcing and seeing it work was very
rewarding in the end.

We tried a variety of different paradigms like using a different database per service with
event sourcing or using saga for example.

### Our services ⚙️

We initially wanted to implement a lot more services, but as you might have figured out
implementing a microservice architecture with 2 people gets out of hand quite fast 😄
That's the reason we kept it as minimal as possible.

#### User service 🙋

We have a user service which handles user CRUD and also the authorization and
authentication (which you usually want to separate into another service)

#### Metadata extraction service 👀

This service extracts as much information as possible from the provided document. It's
using OCR to extract all kinds of text from various images and pdfs.

#### Fulltext-Search-Service 🔍

In order to make all uploaded documents searchable this microservice can handle search
queries of all sorts. We use elasticsearch to implement this kind of search. Via event
sourcing the es-cluster is built each time a service is spun up to make the documents
searchable.

#### File-Service 📂

As the name suggests this service handles all files that are provided to the platform and
makes them accessible if you want to look at and or download a document you searched for.

![Architecture](https://github.com/MaxSquared-WebCraft/findit/assets/15246773/be1e64dd-2506-452c-a2df-7c09f43f6d3f)

## Frontend

If you want to see the frontend implementation go
[here](https://github.com/MaxSquared-WebCraft/findit-frontend)

## Enough talk! How does it work? 🙊

The following image shows how one example file upload could look like in the system. Of
course everything is event based. All events that are produced are depicted as light blue
arrows. The image shows only the upload and metadata processing procedure.

![SampleRequest](https://github.com/MaxSquared-WebCraft/findit/assets/15246773/d5cb2329-8f38-436c-addb-7cb7bbec90da)

## Example video 📽️

If you want to see an example video you can find it [here](docs/output-sample-request.gif)

In the video we're uploading a file and then showing in the logs in the docker desktop app
of various services which are processing the request. At the end we showcase that you can
search for the file name but also for file contents.
