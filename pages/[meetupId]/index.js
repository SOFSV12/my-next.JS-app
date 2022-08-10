import MeetupDetail from "../../components/meetups/MeetupDetail";
import { MongoClient, ObjectId } from "mongodb";
import { Fragment } from "react";
import Head from "next/head";

function MeetupDetails(props) {
  return (
    <Fragment>
      <Head>
        <title>{props.meetupData.title}</title>
        <meta name="description" content={props.meetupData.description} />
      </Head>
      <MeetupDetail
        image={props.meetupData.image}
        title={props.meetupData.title}
        address={props.meetupData.address}
        description={props.meetupData.description}
      />
    </Fragment>
  );
}
//this is to know not for which paths to generate props for during the build process
export async function getStaticPaths() {
  const client = await MongoClient.connect(
    "mongodb+srv://Emman:HkPgiAOx92L3Qlth@cluster0.sc32l.mongodb.net/meetups?retryWrites=true&w=majority"
  );
  const db = client.db();

  const meetupsCollection = db.collection("meetups");

  const meetups = await meetupsCollection.find({}, { _id: 1 }).toArray();

  client.close();

  return {
    fallback: false,
    paths: meetups.map((meetup) => ({
      params: { meetupId: meetup._id.toString() },
    })),
  };
}
// with getStaticProps a page is generated during the build process, it means nextJS
//for a dynamic page next.JS needs to know for which IDvalues it needs to pre-generate the page
export async function getStaticProps(context) {
  // fetch data for a single meetup

  //gets the concrete values of the identifier in the url in this case m1 and m2

  const meetupId = context.params.meetupId;
  const client = await MongoClient.connect(
    "mongodb+srv://Emman:HkPgiAOx92L3Qlth@cluster0.sc32l.mongodb.net/meetups?retryWrites=true&w=majority"
  );
  const db = client.db();

  const meetupsCollection = db.collection("meetups");

  const selectedMeetup = await meetupsCollection.findOne({
    _id: ObjectId(meetupId),
  });

  client.close();

  return {
    props: {
      meetupData: {
        id: selectedMeetup.toString(),
        title: selectedMeetup.title,
        address: selectedMeetup.address,
        image: selectedMeetup.image,
        description: selectedMeetup.description,
      },
    },
  };
}

export default MeetupDetails;
